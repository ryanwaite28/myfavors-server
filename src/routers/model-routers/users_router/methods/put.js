'use strict';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt-nodejs');

const models = require('../../../../models').models;
const chamber = require('../../../../chamber');



/* --- PUT Functions --- */

function sign_in(request, response) {
  (async function() {
    if(request.session.id) { return response.json({ error: true, message: "Client already signed in", online: true, user: request.session.you }) }
    let { email, password } = request.body;
    if(email) { email = email.toLowerCase(); }
    if(!email) {
      return response.json({ error: true, message: 'Email Address field is required' });
    }
    if(!password) {
      return response.json({ error: true, message: 'Password field is required' });
    }
    var check_account = await models.Users.findOne({
      where: { [Op.or]: [{email: email}, {username: email}] }
    });
    if(!check_account) {
      return response.json({ error: true, message: 'Invalid credentials.' });
    }
    if(bcrypt.compareSync(password, check_account.dataValues.password) === false) {
      return response.json({ error: true, message: 'Invalid credentials.' });
    }
    var user = check_account.dataValues;
    delete user['password'];
    request.session.id = chamber.uniqueValue();
    request.session.you = user;

    let session_token = await models.Tokens.findOne({ where: { ip_address: request.ip, user_agent: request.get('user-agent'), user_id: user.id } });
    if(session_token) {
      return response.json({ online: true, user, token: session_token.dataValues.token, message: 'Signed In!' });
    }
    else {
      let new_token = chamber.generateToken(user.id);
      models.Tokens.create({ 
        ip_address: request.ip, 
        user_agent: request.get('user-agent'), 
        user_id: user.id, 
        token: new_token, 
        device: request.device.type 
      });
      return response.json({ online: true, user, token: new_token, message: 'Signed In!' });
    }
  })()
}

function sign_out(request, response) {
  request.session.reset();
  return response.json({ online: false, successful: true });
}



/* --- Exports --- */

module.exports = {
  sign_in,
  sign_out,
}
