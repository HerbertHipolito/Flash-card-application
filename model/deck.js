const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const decksSchema = new Schema({

    title:{
        type:String,
        required:true,
        unique: true
    },
    description:{
        type:String,
    },
    author:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    content:{
        type:Array,
        required:true
    },
    used:{
        type:Number,
        required:true
    }

});


module.exports = mongoose.model('decks',decksSchema);