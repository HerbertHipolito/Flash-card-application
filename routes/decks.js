const router = require('express').Router();
const {getAccessDeckController,postAcessDeckController} = require('../controllers/accessDeckController');
const {getNovoDeckController,postNovoDeckController} = require('../controllers/novoDeckController');
const {myAccountController} = require('../controllers/accountController');
const {authUsersCard} = require('../middlewares/authUsersCard');
const {getInputYoutubeWords,getSelectWords,postSelectWords} = require('../controllers/youtubeWords');
const {deleteController} = require('../controllers/deleteController');
 
router.get('/registerDeck',getNovoDeckController).post('/registerDeck',postNovoDeckController);

router.get('/myAccount',myAccountController);

router.get('/delete/:id',deleteController);

router.get('/insertLink',getInputYoutubeWords).get('/insertLink/:id',getSelectWords).post('/insertLink/:id',postSelectWords);

router.get('/:id',authUsersCard,getAccessDeckController).post('/:id',authUsersCard,postAcessDeckController);


module.exports = router;
