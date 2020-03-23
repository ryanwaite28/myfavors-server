"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bcrypt = require("bcrypt-nodejs");
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const sendgrid_manager_1 = require("../sendgrid-manager");
const template_engine_1 = require("../template-engine");
const chamber_1 = require("../chamber");
class UserService {
    static root_route(request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return response.json({ msg: 'users router' });
        });
    }
    static check_session(request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                if (request.session.id) {
                    const user = Object.assign({}, request.session.you);
                    delete user.password;
                    const session_id = request.session.id;
                    return response.json({ online: true, session_id, user });
                }
                else {
                    return response.json({ online: false });
                }
            }
            catch (e) {
                console.log('error: ', e);
                return response.json({ e, error: true });
            }
        });
    }
    static get_user_by_username(request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const username = request.params.username;
            const userModel = yield models_1.Users.findOne({ where: { username } });
            let user = (userModel && userModel.get({ plain: true }) || {});
            delete user.password;
            return response.json({ user });
        });
    }
    static get_user_by_id(request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const id = parseInt(request.params.id, 10);
            const userModel = yield models_1.Users.findOne({ where: { id } });
            let user = (userModel && userModel.get({ plain: true }) || {});
            delete user.password;
            return response.json({ user });
        });
    }
    static get_random_users(request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const users = yield models_1.Users.findAll({
                limit: 10,
                order: [sequelize_1.fn('RANDOM')],
                attributes: [
                    'id',
                    'displayname',
                    'username',
                    'icon_link',
                    'uuid',
                    'createdAt',
                    'updatedAt',
                ]
            });
            return response.json({ users });
        });
    }
    static sign_out(request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            request.session.reset();
            return response.json({ online: false, successful: true });
        });
    }
    static sign_up(request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (request.session.id) {
                return response.status(400).json({ error: true, message: 'Client already signed in' });
            }
            const displayname = request.body.displayname;
            const username = request.body.username;
            const email = request.body.email &&
                request.body.email.toLowerCase().replace(/\s/gi, '');
            const password = request.body.password;
            const confirmPassword = request.body.confirmPassword;
            if (!displayname) {
                return response.status(400).json({
                    error: true,
                    message: 'Display name field is required'
                });
            }
            if (!username) {
                return response.status(400).json({
                    error: true,
                    message: 'Username field is required'
                });
            }
            if (!email) {
                return response.status(400).json({
                    error: true,
                    message: 'Email address field is required'
                });
            }
            if (!password) {
                return response.status(400).json({
                    error: true,
                    message: 'Password field is required'
                });
            }
            if (!confirmPassword) {
                return response.status(400).json({
                    error: true,
                    message: 'Confirm password field is required'
                });
            }
            if (!chamber_1.validateDisplayName(displayname)) {
                return response.status(400).json({
                    error: true,
                    message: 'Display must be letters only and at least 2 characters long.'
                });
            }
            if (!chamber_1.validateUsername(username)) {
                return response.status(400).json({
                    error: true,
                    message: 'Display must be letters only and at least 2 characters long.'
                });
            }
            if (!chamber_1.validateEmail(email)) {
                return response.status(400).json({
                    error: true,
                    message: 'Email is invalid. Check Format.'
                });
            }
            if (!chamber_1.validatePassword(password)) {
                return response.status(400).json({
                    error: true,
                    message: 'Password must be: at least 7 characters, upper and/or lower case alphanumeric'
                });
            }
            if (password !== confirmPassword) {
                return response.status(400).json({
                    error: true,
                    message: 'Passwords must match'
                });
            }
            const check_email = yield models_1.Users.findOne({ where: { email } });
            if (check_email) {
                return response.status(401).json({ error: true, message: 'Email already in use' });
            }
            const hash = bcrypt.hashSync(password);
            const createInfo = { displayname, username, email, password: hash };
            const new_user = yield models_1.Users.create(createInfo);
            const user = new_user.dataValues;
            const new_token = chamber_1.uniqueValue();
            models_1.Tokens.create({
                ip_address: request.ip,
                user_agent: request.get('user-agent'),
                user_id: user.id,
                token: new_token,
                device: request.device.type
            });
            request.session.id = chamber_1.uniqueValue();
            request.session.you = Object.assign({}, user);
            request.session.youModel = new_user;
            delete user.password;
            const host = request.get('origin');
            const uuid = user.uuid;
            const verify_link = host.endsWith('/')
                ? (host + 'verify-account/' + uuid)
                : (host + '/verify-account/' + uuid);
            const email_subject = 'My Favors - Signed Up!';
            const email_html = template_engine_1.SignedUp_EMAIL(Object.assign(Object.assign({}, request.session.you), { name: user.displayname, verify_link }));
            sendgrid_manager_1.send_email('', user.email, email_subject, email_html)
                .then(email_results => {
                console.log({ signed_up: email_results });
            });
            const responseData = { online: true, user, message: 'Signed Up!', token: new_token, session_id: request.session.id };
            return response.status(200).json(responseData);
        });
    }
    static sign_in(request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(request.body);
            if (request.session.id) {
                return response.json({
                    error: true,
                    message: "Client already signed in",
                    online: true,
                    user: request.session.you
                });
            }
            let { email, password } = request.body;
            if (email) {
                email = email.toLowerCase();
            }
            if (!email) {
                return response.json({ error: true, message: 'Email Address field is required' });
            }
            if (!password) {
                return response.json({ error: true, message: 'Password field is required' });
            }
            const check_account_model = yield models_1.Users.findOne({
                where: { [sequelize_1.Op.or]: [{ email: email }, { username: email }] }
            });
            const check_account = (check_account_model
                ? check_account_model.get({ plain: true })
                : null);
            if (!check_account) {
                return response.json({ error: true, message: 'Invalid credentials.' });
            }
            if (bcrypt.compareSync(password, check_account.password) === false) {
                return response.json({ error: true, message: 'Invalid credentials.' });
            }
            var user = check_account;
            delete user.password;
            request.session.id = chamber_1.uniqueValue();
            request.session.you = user;
            let session_token_model = yield models_1.Tokens.findOne({ where: { ip_address: request.ip, user_agent: request.get('user-agent'), user_id: user.id } });
            if (session_token_model) {
                return response.json({ online: true, user, token: session_token_model.get('token'), message: 'Signed In!' });
            }
            else {
                let new_token = chamber_1.uniqueValue();
                models_1.Tokens.create({
                    ip_address: request.ip,
                    user_agent: request.get('user-agent'),
                    user_id: user.id,
                    token: new_token,
                    device: request.device.type
                });
                return response.json({ online: true, user, token: new_token, message: 'Signed In!' });
            }
        });
    }
}
exports.UserService = UserService;
