const {User} = require("../models/user-model");

exports.signupMw = async(req,res,next) => {
    try{
           
    const user = await User.findOne({where : {email : req.body.email}});
     
    if(!req.body.name){ 
     return res.status(400).send(`Name is not provided`);
    }
    
    if(!req.body.email){
        return res.status(400).send(`Email cant be empty`);
    }
    if(user !== null){
      return res.status(400).send(`Email is already registered`);
    }
   
    if(!req.body.password){
        return res.status(400).send(`Password should be provided`);
    }

    if(!checkingEmail(req.body.email)){
        return res.status(400).send(`Email is not valid`);
    }
  


 next();
 
}catch(err){
    res.status(500).send(`error in signupMw ${err}`);
}
}

const checkingEmail = (email) => {
   return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
}


exports.signinMw = async(req,res,next) => {

    try{
    
    if(!req.body.email){
    return res.status(400).send(`Email is must for signin`);
    }
   
    if(!req.body.password){
        return res.status(400).send(`Password is must for signin`);
    }
    

   next();

}catch(err){
    res.status(500).send(`error in signinMw ${err}`);
}
}

exports.verifyJwtTokenForGetCall = async(req,res,next) => {
   
    try{

         const user = await User.findOne({where :{email : req.body.email}});

        const token = req.headers['access-token'];
        if(!token){
           return res.status(403).send(`token is not provided, please provide it`);
        }

        jwt.verify(token,process.env.secret, (err,decoded) => {
            if(err){
               return res.status(401).send(`token is not valid, please recheck it`);
            }

            req.email = decoded.id; 

            if(req.email !== user.email){
                return res.status(403).send(`only registered user can perform this action`);
            }

        }) 
        next(); 

    }catch(err){
        res.status(500).send(`error in verifyJwtTokenForFindCall ${err}`);
        console.log(`err in verifyJwtToken ${err}`);
    }

}