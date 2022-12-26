require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const {isAuthUser,isAuthAdmin} = require('./middlewares/auth');

const store = new session.MemoryStore();

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','GET,PUT,POST,DELETE');
    app.use(cors());
    next()
})

const connectDB = require('./config/dbconfig');

const PORT = process.env.PORT || 3500;
const connection = connectDB();

app.set('view engine','ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.DATABASE_SECRET,
    name:process.env.DATABASE_NAME,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*15
    },
    store
}));

app.use('/', express.static(path.join(__dirname, '/public')));

app.use('/',require('./routes/root'));
app.use('/login',require('./routes/login'));
app.use('/logout',require('./routes/logout'));
app.use('/register',require('./routes/register'));
app.use('/user',isAuthUser,require('./routes/decks'));

mongoose.connection.once('open',()=>{
    console.log('connected to mongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

