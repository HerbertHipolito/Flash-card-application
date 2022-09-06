require('dotenv').config();
const path = require('path');

const isAuthUser = (req,res,next) =>{
    (req.session.authenticated && req.session.user.role === process.env.DATA_USER_ROLE)? next(): res.status(400).json({'message':'unauthorized access'});

}

const isAuthAdmin = (req,res,next) =>{
    (req.session.authenticated && req.session.user.role === process.env.DATA_ADMIN_ROLE)? next(): res.status(400).json({'message':'unauthorized access'});
}


module.exports = {isAuthUser,isAuthAdmin}