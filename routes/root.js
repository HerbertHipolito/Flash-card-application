const express = require('express');
const router = express.Router();
const {getRootController} = require('../controllers/rootController');

router.get('/',getRootController);

module.exports = router;
