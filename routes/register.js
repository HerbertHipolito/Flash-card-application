const router = require('express').Router()
const {registerGetController,registerPostController} = require('../controllers/registerController');

router.get('/',registerGetController).post('/',registerPostController)

module.exports = router;