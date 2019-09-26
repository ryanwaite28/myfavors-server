const GET = require('./methods/get');
const POST = require('./methods/post');
const PUT = require('./methods/put');
const DELETE = require('./methods/delete');

const chamber = require('../../../chamber');

const router = require('express').Router();

router.get('/', GET.root_route);
router.get('/:username', GET.get_user_by_username);
router.get('/:id', GET.get_user_by_id);
router.get('/random', GET.get_random_users);
router.get('/sign_out', GET.sign_out);

router.post('/', POST.sign_up);

router.put('/', PUT.sign_in);
router.put('/sign_out', PUT.sign_out);

router.delete('/:id', chamber.SessionRequired, DELETE.delete_account);

module.exports = router;