
const decks = require('../model/deck');


const authUsersCard = async (req,res,next) =>{

    const myDeck = await decks.findById(req.params.id);
    if(!myDeck) return res.status(400).json({'message':'Deck not found'});
    myDeck.author===req?.session?.user.login?next():res.status(400).json({'message':'access denied'});

}

module.exports = {authUsersCard}