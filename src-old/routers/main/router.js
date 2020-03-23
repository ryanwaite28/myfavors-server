'use strict';

const GET = require('./methods/get');
const POST = require('./methods/post');
const PUT = require('./methods/put');
const DELETE = require('./methods/delete');

const chamber = require('../../chamber');

const router = require('express').Router();

// mount model routers

const users_router = require('../model-routers/users_router/router');

router.use('/users', users_router);

router.get('/', GET.welcome);
router.get('/check_session', GET.check_session);



module.exports = {
  router
}
