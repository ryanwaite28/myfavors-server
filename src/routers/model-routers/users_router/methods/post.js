'use strict';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt-nodejs');

const models = require('../../../../models').models;
const chamber = require('../../../../chamber');
const sendgrid_manager = require('../../../../sendgrid_manager');



/* --- POST Functions --- */

function sign_up(request, response) {
  (async function() {
    if(request.session.id) { return response.json({ error: true, message: "Client already signed in", online: true, user: request.session.you }) }

    var { displayname, username, email, password, confirmPassword } = request.body;
    if(email) { email = email.toLowerCase().trim(); }
    if(username) { username = username.toLowerCase().trim(); }

    if(!displayname) {
      return response.json({ error: true, message: 'Display Name field is required' });
    }
    if(!username) {
      return response.json({ error: true, message: 'Username field is required' });
    }
    if(!email) {
      return response.json({ error: true, message: 'Email Address field is required' });
    }
    if(!password) {
      return response.json({ error: true, message: 'Password field is required' });
    }
    if(!confirmPassword) {
      return response.json({ error: true, message: 'Confirm Password field is required' });
    }

    if(!chamber.validateDisplayName(displayname)) {
      return response.json({ error: true, message: 'Display name must be letters only, 2-50 characters long. Spaces, dashes and apostrophes are allowed' });
    }
    if(!chamber.validateUsername(username)) {
      return response.json({ error: true, message: 'Username must be letters and numbers only, 2-50 characters long. Dashes and underscores are allowed' });
    }
    if(!chamber.validateEmail(email)) {
      return response.json({ error: true, message: 'Email is invalid. Check Format.' });
    }
    if(!chamber.validatePassword(password)) {
      return response.json({
        error: true,
        message: 'Password must be: at least 7 characters, upper and/or lower case alphanumeric'
      });
    }
    if(password !== confirmPassword) {
      return response.json({ error: true, message: 'Passwords must match' });
    }

    var check_email = await models.Users.findOne({ where: { email } });
    if(check_email) {
      return response.json({ error: true, message: 'Email already in use' });
    }

    var check_username = await models.Users.findOne({ where: { username } });
    if(check_username) {
      return response.json({ error: true, message: 'Username already in use' });
    }

    /* Data Is Valid */

    password = bcrypt.hashSync(password);
    let new_user = await models.Users.create({ displayname, username, email, password });
    let user = new_user.dataValues;
    let new_token = chamber.generateToken(user.id);
    models.Tokens.create({ 
      ip_address: request.ip, 
      user_agent: request.get('user-agent'), 
      user_id: user.id, 
      token: new_token,
      device: request.device.type
    });
    delete user['password'];
    request.session.id = chamber.uniqueValue();
    request.session.you = user;

    // // send verification email
    // let host = request.get('host');
    // let unique_value = response.locals.you.unique_value;
    // let verify_link = host.endsWith('/') ?
    // (host + 'verify_user_email/' + unique_value) :
    // (host + '/verify_user_email/' + unique_value);

    // let email_subject = 'Epsity - Signed Up! Confirm Email';
    // let email_html = templateEngine.SignedUp_EMAIL({ verify_link });
    // sendgrid_manager.send_email(null, response.locals.you.email, email_subject, email_html);

    return response.json({ online: true, user, message: 'Signed Up!', token: new_token });
  })()
}



/* --- Exports --- */

module.exports = {
  sign_up,
}
