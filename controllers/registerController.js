const {htmlTagsController} = require('../controllers/tagsController');
const path = require('path');
const users = require('../model/user');
const bcrypt = require('bcrypt');

const registerGetController = (req,res) =>{

    var header = 'initialHeader';

    if(req.session.authenticated) header = 'loggedHeader';

    htmlTagsController([header]).then(
        (tags) =>{
            res.render(path.join('..','views','register'),{
                header:tags[header]
            });
        }
    )

}

const registerPostController = async (req,res) =>{

    if(req.session.authenticated){
        console.log('You are already logged');
        return res.redirect('/');
    } 

    if(!req.body?.login || !req.body?.password || !req.body?.email || !req.body?.name ) return res.status(400).json({'message':'input misssing'});

    try{
        const {login,password,email,name} = req.body;

        const duplicateLogin = await users.findOne({login:login});
    
        if(duplicateLogin) return res.status(409).json({'message':'User already exists'});

        const duplicateEmail = await users.findOne({email:email});

        if(duplicateEmail) return res.status(409).json({'message':'Email already exists'});
        
        const hashedPassword = await bcrypt.hash(password,10);

        const result = await users.create({
            'login':login,
            'fullName':name,
            'password':hashedPassword,
            'email':email,
            'role':55
        })

        console.log('The count has successfully been created');
        return res.status(200).redirect('/')

    }catch(error){
        console.log(error);
        return res.status(400).json({'message':'Error'});
    }

}

module.exports = {registerGetController,registerPostController}