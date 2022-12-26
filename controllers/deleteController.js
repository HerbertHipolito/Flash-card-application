const decks = require('../model/deck');
const htmlTagsController = require('./tagsController');
const path = require('path');

const deleteController = async (req,res) =>{
    
    try{

        const result = await decks.deleteOne({ _id: req.params.id });
        return res.status(200)

    }catch(error){

        return res.status(400).send(error);
        
    }
    
}

module.exports = {deleteController};