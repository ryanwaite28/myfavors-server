"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nunjucks = require("nunjucks");
const path = require("path");
const htmlPath = path.join(__dirname, '../html');
function installExpressApp(app) {
    nunjucks.configure(htmlPath, {
        autoescape: true,
        express: app
    });
}
exports.installExpressApp = installExpressApp;
function SignedUp_EMAIL(data) {
    return nunjucks.render('templates/email/SignedUp.html', { data });
}
exports.SignedUp_EMAIL = SignedUp_EMAIL;
function ContactUser_EMAIL(data) {
    return nunjucks.render('templates/email/ContactUser.html', { data });
}
exports.ContactUser_EMAIL = ContactUser_EMAIL;
function PasswordReset_EMAIL(data) {
    return nunjucks.render('templates/email/PasswordReset.html', { data });
}
exports.PasswordReset_EMAIL = PasswordReset_EMAIL;
function PasswordResetSuccess_EMAIL(data) {
    return nunjucks.render('templates/email/PasswordResetSuccess.html', { data });
}
exports.PasswordResetSuccess_EMAIL = PasswordResetSuccess_EMAIL;
function TenantRequest_Sent(data) {
    return nunjucks.render('templates/email/RequestSent.html', { data });
}
exports.TenantRequest_Sent = TenantRequest_Sent;
function TenantRequest_Canceled(data) {
    return nunjucks.render('templates/email/RequestCanceled.html', { data });
}
exports.TenantRequest_Canceled = TenantRequest_Canceled;
function TenantRequest_Accepted(data) {
    return nunjucks.render('templates/email/RequestAccepted.html', { data });
}
exports.TenantRequest_Accepted = TenantRequest_Accepted;
function TenantRequest_Declined(data) {
    return nunjucks.render('templates/email/RequestDeclined.html', { data });
}
exports.TenantRequest_Declined = TenantRequest_Declined;
