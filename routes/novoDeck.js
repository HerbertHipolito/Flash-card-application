const router = require('express').Router();
const {getNovoDeckController,postNovoDeckController} = require('../controllers/novoDeckController');

router.get('/',getNovoDeckController).post('/',postNovoDeckController);

module.exports = router;
