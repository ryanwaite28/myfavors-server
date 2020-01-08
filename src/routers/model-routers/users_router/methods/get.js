'use strict';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const models = require('../../../../models').models;
const chamber = require('../../../../chamber');



/* --- GET Functions --- */

function root_route(request, response) {
  response.json({ msg: 'users router' });
}

function get_user_by_username(request, response) {
  const username = request.params.username;
  models.Users.findOne({ where: { username } })
  .then(userModel => {
    let user = userModel.get({ plain: true });
    delete user['password'];
    return response.json({ user });
  })
}

function get_user_by_id(request, response) {
  const id = parseInt(request.params.id, 10);
  models.Users.findOne({ where: { id } })
  .then(userModel => {
    let user = userModel.get({ plain: true });
    delete user['password'];
    return response.json({ user });
  })
}

function get_random_users(request, response) {
  models.Users.findAll({
    limit: 10,
    order: [Sequelize.fn( 'RANDOM' )],
    attributes: [
      Sequelize.fn( 'RANDOM' ),
      'id',
      'displayname',
      'username',
      'icon_link',
      'uuid',
      'createdAt',
      'updatedAt',
    ]
  })
  .then(resp => {
    let list = resp.map(i => i.get({plain: true}));
    return response.json({ users: list });
  })
}

function sign_out(request, response) {
  request.session.reset();
  return response.json({ online: false, successful: true });
}



/* --- Exports --- */

module.exports = {
  root_route,
  get_user_by_username,
  get_user_by_id,
  get_random_users,
  sign_out,
}
