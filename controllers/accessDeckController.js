const decks = require('../model/deck');
const users = require('../model/user');
const {htmlTagsController} = require('../controllers/tagsController');
const path = require('path');

const getAccessDeckController = async (req,res) =>{
    
    try{
    
        if((!req?.params?.id)) return res.status(400).json({'message':'deck id not received'});
        var learned = [];
        var needToLearn = [];
        const myDeck = await decks.findById(req.params.id);
        var hitRate = null;
        var randomCardName = null
        var answerRandomCardName = null

        myDeck['content'].forEach((element) =>{
            element['learned']?learned.push(element):needToLearn.push(element);
        })

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
                    myDeck:myDeck, 
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

    var cardIndex = null;
    var condition = true;

    for(let i = 0;i < myDeck['content'].length;i++){

        if(myDeck['content'][i]['result']===req.body.userAnswer && myDeck['content'][i]['nameCard'] === req.session.user.keyCard){
            
            if(req.body.cardButton === 'Check'){
                myDeck['content'][i]['hits']+=1;
                myDeck.markModified(`content.${i}.hits`);
            }
        
            if(req.body.cardButton === 'I learned it') {
                myDeck['content'][i]['learned'] = true;
                myDeck.markModified(`content.${i}.learned`);
                
                const user = await users.findOne({login:req.session.user.login});
                user.familiarWords.push(req.session.user.keyCard);
                const resultWord = await user.save();
            }    
            condition = false;
            break;
        }

    }

    if(condition) {
        //when the user answer is wrong.
        for (let i=0;i<myDeck['content'].length;i++){

            if(myDeck['content'][i]['nameCard'] === req.session.user.keyCard) {    
                myDeck['content'][i]['failure'] += 1;
                myDeck.markModified(`content.${i}.failure`);
                break;
            }
        }

    }

    const result = await myDeck.save();
    return res.redirect(`/user/${req.params.id}`);

}


module.exports = {getAccessDeckController,postAcessDeckController};