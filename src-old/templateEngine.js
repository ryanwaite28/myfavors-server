'use strict';

const nunjucks = require('nunjucks');

function installExpressApp(app) {
  nunjucks.configure(`${__dirname}/_src/html/`, {
    autoescape: true,
    express: app
  });
}

/* --- Emails --- */

const email_templates = {};

email_templates.SignedUp_EMAIL = function(data) {
  return nunjucks.render('templates/email/SignedUp.html', { data });
}

email_templates.ContactUser_EMAIL = function(data) {
  return nunjucks.render('templates/email/ContactUser.html', { data });
}

email_templates.PasswordReset_EMAIL = function(data) {
  return nunjucks.render('templates/email/PasswordReset.html', { data });
}

email_templates.PasswordResetSuccess_EMAIL = function(data) {
  return nunjucks.render('templates/email/PasswordResetSuccess.html', { data });
}

email_templates.NewReview_EMAIL = function(data) {
  return nunjucks.render('templates/email/NewReview.html', { data });
}

/* --- Exports --- */

module.exports = {
  nunjucks,
  installExpressApp,
  email_templates,
}
