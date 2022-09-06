const path = require('path');
const users = require('../model/user');
const {htmlTagsController} = require('./tagsController');
const bcrypt = require('bcrypt');
require('dotenv').config();

const loginGetController = (req,res) => {

    if(req.session.authenticated) return res.redirect('/');

    htmlTagsController(['initialHeader'],res).then( (tags)=>{
        
        res.render(path.join('..','views','login'),{
            header:tags['initialHeader']
            })
        }   
    );
}

const loginPostController = async (req,res) => {

    if(!req.body?.login || !req.body?.password  ) return res.status(400).json({'message':'Input missing'});
    
    const user = await users.findOne({login:req.body.login});
    if(!user) return res.status(400).json({'message':'Login or password not found'});
    const match = await bcrypt.compare(req.body.password,user.password);
    if(!match) return res.status(400).json({'message':'Login or password not found'});

    req.session.authenticated = true; 

        req.session.user = {
            "name":user.fullName,
             "role":user.role,
             "login":user.login
        };
    
    return res.redirect('/');

}

const logoutController = (req,res) =>{

    if(req.session.authenticated){
        req.session.destroy(
            (error)=>{
                res.clearCookie(process.env.DATABASE_NAME);
                return res.redirect('/');
            }
        )
    }else{
        console.log('You are not logged');
        return res.redirect('/');
    }

}

module.exports = {loginGetController,loginPostController,logoutController};

