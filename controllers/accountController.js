const router = require('express').Router();
const {htmlTagsController} = require('../controllers/tagsController');
const path = require('path');
const users = require('../model/user');
const decks = require('../model/deck');
const {format} =  require('date-fns');

const myAccountController = async (req,res) =>{

    const user = await users.findOne({login:req.session.user.login});

    if(!user) return res.status(400).json({'message':'user not found'});

    var userToSend = {};
    var conditionStatistics = true;

    userToSend['login'] = user['login'];
    userToSend['email'] = user['email'];
    userToSend['fullName'] = user['fullName'];

    userToSend['noDecks'] = await decks.find({author:req.session.user.login}).count();

    userToSend['noDecksRemaining'] = await decks.find({ //verify what went wrong here
        $and:[
            {author:req.session.user.login},
            {content:{$elemMatch:{learned:false}}}
        ]
    }).count();

    const userDecks = await decks.find({  //send cards
        $and:[
            {author:req.session.user.login},
            {content:{$elemMatch:{learned:true}}}
        ]
    })

     const noFailurePerCard = await decks.aggregate([
        {$unwind : "$content" } ,
        {$match:{author:req.session.user.login}},
        {
            $group:{
            _id:'$title',
            count:{
                $sum:'$content.failure'
                }
            }
        },
        {$sort:{count:-1}},
        {$limit:1}    
    ])

     const noUnlearnedCard = await decks.aggregate([
        { $unwind : "$content" } ,
        {$match:{author:req.session.user.login}},
        {
            $group:{
            _id:'$title',
            count:{
                $sum:{
                    $cond:[{$eq:['$content.learned',false]},1,0] //verify here
                    }
                }
            }
        },
        {$sort:{count:-1}},
        {$limit:1}        
    ])
    
        
     const MostAccessedDeck = await decks.aggregate([
        {$match:{author:req.session.user.login}},
        {
            $group:{
            _id:'$title',
            maxAccessedDeck:{
                $max:"$used"
                }
            }
        },
        {$sort:{maxAccessedDeck:-1}},
        {$limit:1}        
    ])

     const lessAccessedDeck = await decks.aggregate([
        {$match:{author:req.session.user.login}},
        {
            $group:{
            _id:'$title',
            lessAccessedDeck:{
                $min:"$used"
                }
            }
        },
        {$sort:{lessAccessedDeck:1}},
        {$limit:1}        
    ])

    userToSend['noFailurePerCard'] = noFailurePerCard[0]
    userToSend['noUnlearnedCard'] = noUnlearnedCard[0]
    userToSend['MostAccessedDeck'] = MostAccessedDeck[0]
    userToSend['lessAccessedDeck'] = lessAccessedDeck[0]

    if(!userToSend['noDecks']  || !userToSend['noDecksRemaining']  || !userToSend['noFailurePerCard'] || !userToSend['noUnlearnedCard'] || !userToSend['MostAccessedDeck'] || !userToSend['lessAccessedDeck']) conditionStatistics = null;

    var dateTransformed = [];

    for(deck of userDecks){
        dateTransformed.push(`${format(deck['date'],'dd/MM/yyyy')}`)
    }

    if(userDecks){
         //verify this one
        
        htmlTagsController(['loggedHeader'],res).then(
            tags=>{
                res.render(path.join('..','views','myAccount'),{
                    header:tags['loggedHeader'],
                    userToSend:userToSend,
                    decks:userDecks,
                    date:dateTransformed,
                    conditionStatistics:conditionStatistics
                    })
                }
            )
       
    }else{
        return res.status(400).json({'message':'deck not found'});
    }
    
}

module.exports = {myAccountController};
