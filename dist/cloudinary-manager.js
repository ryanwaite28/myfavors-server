"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const chamber_1 = require("./chamber");
function upload_file(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            return reject({ error: true, filename: undefined, image_path: undefined, message: 'no file given...' });
        }
        const unique_filename = chamber_1.uniqueValue();
        const filename = unique_filename + file.name;
        const image_path = __dirname + '/' + filename;
        file.mv(filename, (error) => {
            if (error) {
                return reject({ error: true, filename: undefined, image_path: undefined, message: 'could not upload file...' });
            }
            else {
                return resolve({ error: false, filename, image_path, message: undefined });
            }
        });
    });
}
exports.upload_file = upload_file;
function store_image(file, public_id) {
    return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
        const api_key = process.env.CLOUDINARY_API_KEY;
        const api_secret = process.env.CLOUDINARY_API_SECRET;
        const oneCredentialMissing = (!cloud_name || !api_key || !api_secret);
        if (oneCredentialMissing) {
            console.log({ file, public_id, cloud_name, api_key, api_secret });
            const errorObj = {
                error: true,
                results: undefined,
                message: `One cloudinary credential is missing; upload attempt canceled.`
            };
            return reject(errorObj);
        }
        const filedata = yield upload_file(file);
        if (filedata.error) {
            const errorObj = { error: filedata.error, message: filedata.message };
            return reject(errorObj);
        }
        cloudinary.config({ cloud_name, api_key, api_secret });
        if (public_id) {
            console.log('deleting cloud image with public_id:', public_id);
            cloudinary.uploader.destroy(public_id, (error, result) => {
                if (error) {
                    console.log('error deleting...', error);
                }
                else {
                    console.log('deleted from cloudinary successfully!', 'public_id: ' + public_id, 'result: ', result);
                }
            });
        }
        cloudinary.uploader.upload(filedata.filename, (error, result) => {
            fs.unlink(filedata.filename, (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('file deleted successfully!', filedata.filename);
                }
            });
            console.log({ error });
            return result && result.secure_url ?
                resolve({ error: false, result, filedata }) :
                reject({ error: true, result, filedata });
        });
    }));
}
exports.store_image = store_image;
