const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tagsSchema = new Schema({

    tag:{
        type:String,
        required:true,
    },
    code:{
        type:String,
        required:true
    },

});


module.exports = mongoose.model('tags',tagsSchema);