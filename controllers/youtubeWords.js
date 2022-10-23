const path = require('path');
const htmlTagsController = require('./tagsController');
const translate = require('translate');
const decks = require('../model/deck');
const users = require('../model/user');

function removeDuplicates(Allwords,learnedWords) {
    return Allwords.filter((word,
        index) => learnedWords.indexOf(word) === -1);
}

const getInputYoutubeWords = (req,res) =>{
    return res.render(path.join('..','views','registerLink'),{
        page:1,
        error:false
    });
}

const getSelectWords = async (req,res) =>{

    if(!req?.params?.id || req?.params?.id === "") return res.status(400).json({'message':' Id video not received'});
    const user = await users.findOne({login:req.session.user.login});
    
    var getSubtitles = require('youtube-captions-scraper').getSubtitles;

    const allPhases = getSubtitles({
    videoID: `${req.params.id}`,
    lang: 'en' // default: `en`
    
}).then(function(captions) {

        let textM = '';
        for(let i=0;i<captions.length; i++){
        textM += " "+captions[i].text;
        }
        textM = textM.replace(/[\r\n]/gm, '');  // Remove line break.
        textM = textM.replaceAll("   "," ").replaceAll("  "," "); // Some phrases may be sepaated by 1 or 2 space character.
        textM = textM.replaceAll("."," ");   //The captions sometimes have two words gathered by . or , . Then, they are replaced with a space character.
        textM = textM.replaceAll(","," ");
        textM = textM.toLowerCase();

        var words = textM.split(" "); 

        var learnedWords = user.familiarWords;

        words = [...new Set(words)];
        const unknownWords =  removeDuplicates(words,learnedWords)// Remove duplicated words.

        return res.render(path.join('..','views','registerLink'),{
            page:2,
            words:words,
            unknownWords:unknownWords
                }
            )
        }

    ).catch(function(error){

        console.log('Something went wrong: ',error);
        
        return res.render(path.join('..','views','registerLink'),{
            page:1,
            error:true
                }
            );
    })

}

const postSelectWords = async (req,res) =>{
    
    if(!req.body) return res.status(400).json({'message':'words not received'});
    try{
        
        const myDeck = await decks.findOne({author:req.session.user.login,title:req.body.deckName})
        
        delete req.body.deckName
        
        if(!myDeck) return res.status(400).json({'message':'deck not found'});
        
        var myCards = myDeck.content;        //Getting the old cards
        var englishWords = Object.keys(req.body); // Getting the english words selected by the user.

        var translatedwords = await translate(englishWords, "pt");

        translatedwords = translatedwords.split(",");

        for(let i=0;i<translatedwords.length;i++){ //Joining the cards with the new ones.

            translatedwords[i] = translatedwords[i].replace(' ',''); //removing the space character from the words.
            myCards.push({"nameCard":englishWords[i].toLowerCase(),"result":translatedwords[i].toLowerCase(),"learned":false,"hits":0,"failure":0});

        }

        var myCards = [...new Map(myCards.map(v => [v.nameCard, v])).values()] // Removing duplicate cards based on the nameCard attribute.
        myDeck.content = myCards;
        const result = await myDeck.save();

        return res.render(path.join('..','views','registerLink'),{
            page:3,
                }
            )

    }catch(error){
        console.log(error);
        return res.status(400).json({'message':error});
    }
    
}

module.exports = {getInputYoutubeWords,getSelectWords,postSelectWords}