'use strict';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const models = require('../../../../models').models;
const chamber = require('../../../../chamber');



/* --- DELETE Functions --- */

function delete_account (request, response) {

}



/* --- Exports --- */

module.exports = {
  delete_account,
}
