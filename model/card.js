const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cardsSchema = new Schema({
    text:{
        type:String,
        required:true,
    },
    author:{
        type:String,
        required:true
    },
    data:{
        type:Date,
        required:true
    },
    learned:{
        type:Boolean,
        required:true
    }
});


module.exports = mongoose.model('cards',cardsSchema);