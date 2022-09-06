const router = require('express').Router();
const {logoutController} = require('../controllers/loginController');

router.get('/',logoutController);

module.exports = router;