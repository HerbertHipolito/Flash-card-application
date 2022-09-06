const path =  require('path');
const decks = require('../model/deck');
const {htmlTagsController} =  require('../controllers/tagsController');
const {format} =  require('date-fns');
 

function SplitingContant(content){

    // The symbols chosen to split the content string is # and :

    var array = content.split("#");
    var object = [];
    var inputError = false;

    for(element of array){ //validating the input content.

        var count = 0;

        for(letter of element){

            if(letter === ':') count+=1;
            if(count>1) break;    
        
        }

        if(count!==1){     
            inputError = true;
            break;
        }
    }

    if(!inputError){

        for(let i=0;i<array.length;i++){
        
            var card = array[i].split(":");
            
            object.push({
                'nameCard':card[0],
                'result':card[1],
                'learned':false,
                'hits':0,
                'failure':0
            });
    
        }
    
        return object;

    }else{
        return null
    }

}

const getNovoDeckController = (req,res) =>{

    htmlTagsController(['loggedHeader']).then(tags =>{
        res.render(path.join('..','views','registerDeck'),{
            header:tags['loggedHeader'],
            error:false
        })
    })

}

const postNovoDeckController = async (req,res) =>{

    try{
        var content = [];
        
        if(!(req.body?.title && req.body?.description )) throw Error('Input missing');

        const duplicate = await decks.findOne({title:req.body.title});

        if(duplicate) throw Error('Deck title already exists');

        const dateNow = `${format(new Date(),'MM/dd/yyyy HH:mm:ss')}`;
        
        if(req.body?.content) content = SplitingContant(req.body.content);

        const result = await decks.create({
            "title":req.body.title,
            "description":req.body.description,
            "author":req.session.user.login,
            "date":dateNow,
            "content":content,
            "used":0
        });
        
        return res.status(200).redirect('/');

    }catch(errorMessage){

        console.log(errorMessage);

        htmlTagsController(['loggedHeader']).then(tags =>{
            res.render(path.join('..','views','registerDeck'),{
                header:tags['loggedHeader'],
                error:errorMessage
            })
        })
    }

}

module.exports = {getNovoDeckController,postNovoDeckController}