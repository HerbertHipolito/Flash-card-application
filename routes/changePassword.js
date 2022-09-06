const router = require('express').Router()
const {getChangePassword,postChangePassword} = require('../controllers/ChangePasswordController');

router.get('/',getChangePassword).post('/',postChangePassword);

module.exports = router;