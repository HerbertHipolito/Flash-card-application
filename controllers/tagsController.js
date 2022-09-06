const path = require('path');
const htmlTags = require('../model/htmlTags');

const htmlTagsController = async (tags,res) =>{
    const tagsFound = await htmlTags.find({tag:tags}).exec();
    
    if(!tagsFound) return res.status(400).json({'message':'tag not Found'});
    
    var code = {}
    for(let i=0;i<tagsFound.length;i++){
        code[tagsFound[i]['tag']] = tagsFound[i]['code'];
    }
    
    return code

}

module.exports = {htmlTagsController};