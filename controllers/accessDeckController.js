const decks = require('../model/deck');
const {htmlTagsController} = require('../controllers/tagsController');
const path = require('path');
const { isConstructorDeclaration } = require('typescript');


const getAccessDeckController = async (req,res) =>{
    
    try{
    
        if((!req?.params?.id)) return res.status(400).json({'message':'deck id not received'});
        var learned = [];
        var needToLearn = [];
        const myDeck = await decks.findById(req.params.id);
        var hitRate = null;
        var randomCardName = null
        var answerRandomCardName = null

        for(let i=0;i<myDeck['content'].length;i++){
            myDeck['content'][i]['learned']?learned.push(myDeck['content'][i]):needToLearn.push(myDeck['content'][i]);
        }

        if(needToLearn.length!==0){

            const randomIndex = Math.floor(Math.random()*needToLearn.length);
            const randomCard = needToLearn[randomIndex];
            if (!((randomCard['failure']+randomCard['hits'])===0)){
                hitRate = randomCard['hits']/(randomCard['failure']+randomCard['hits']);
                hitRate = hitRate.toFixed(2);
            }
            randomCardName = randomCard['nameCard'];
            answerRandomCardName = randomCard['result'];

        }

        req.session.user.keyCard = randomCardName;

        myDeck.used += 1;
        const result = await myDeck.save();

        htmlTagsController(['loggedHeader']).then(
            (tags)=>{
                res.render(path.join('..','views','accessDeck'),{
                    header:tags['loggedHeader'],
                    myDeck:myDeck, //change here?
                    learned: learned,
                    remainingCards:needToLearn.length,
                    randomCardName: randomCardName,
                    hitRate:hitRate,
                    answerRandomCardName:answerRandomCardName
                })
            }
        )
    
    }catch(error){
        console.log(error);
    }

}

const postAcessDeckController = async (req,res) =>{

    const myDeck = await decks.findById(req.params.id);
    
    if(!myDeck) return res.status(400).json({'message':'Deck not found'});

    var content = myDeck['content'];
    var cardIndex = null;
    var condition = false;

    for(let i=0;i<content.length;i++){

        if(content[i]['result']===req.body.userAnswer){
            cardIndex = i;
            condition = true;
            break;
        }

    }

    if(condition) {
        
        if(req.body.cardButton === 'Check'){

            myDeck['content'][cardIndex]['hits']+=1;
            myDeck.markModified(`content.${cardIndex}.hits`);

        }
    
        if(req.body.cardButton === 'I learned it') {
    
            myDeck['content'][cardIndex]['learned'] = true;
            myDeck.markModified(`content.${cardIndex}.learned`);
    
        }
        
    }else{
        // deal with the answer user is wrong.

        for (let i=0;i<content.length;i++){

            if(content[i]['nameCard'] === req.session.user.keyCard) {
                cardIndex = i;
                break;
            }
        }

        myDeck['content'][cardIndex]['failure'] += 1;
        myDeck.markModified(`content.${cardIndex}.failure`);
    }
    const result = await myDeck.save();
    
    return res.redirect(`/user/${req.params.id}`);

}


module.exports = {getAccessDeckController,postAcessDeckController};