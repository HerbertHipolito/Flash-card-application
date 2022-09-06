const express = require('express');
const router = express.Router();
const {loginGetController,loginPostController} =  require('../controllers/loginController');

router.get('/',loginGetController).post('/',loginPostController);

module.exports = router;