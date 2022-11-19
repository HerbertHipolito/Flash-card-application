const path = require('path');
const {htmlTagsController} = require('../controllers/tagsController');
const decks = require('../model/deck');
const {format} =  require('date-fns');

const getRootController = async (req,res) =>{

    var header = 'initialHeader';
    var condition = false;
    var userDecks = null;
    var someDecks = null;
    
    if(req.session.authenticated){

        header = 'loggedHeader';
        condition = true;
        userDecks = await decks.find({author:req.session.user.login});
        var newDates = [];
        var ids = []; 

        for(let i=0;i<userDecks.length;i++){
            
            newDates.push(`${format(userDecks[i]['date'],'dd/MM/yyyy')}`);
            ids.push(userDecks[i]['_id'].valueOf());

        }
        
    }else{
        someDecks = await decks.find().limit(12);
    } 
    

    htmlTagsController([header]).then(
         
        (tags)=>{
            
            res.render(path.join('..','views','main'),{
                header:tags[header],
                logged:condition,
                decks:userDecks,
                dates:newDates,
                identification:ids,
                someDecks:someDecks
            })
        }
    )

}

module.exports = {getRootController}