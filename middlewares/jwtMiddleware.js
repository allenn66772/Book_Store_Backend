const jwt=require('jsonwebtoken');

const jwtMiddleware=(req,res,next)=>{
    const token=req.headers.authorization.split(" ")[1];
    console.log(token);
    try{
        const jwtResponse=jwt.verify(token,process.env.JWTSecretKey);
        req.payload=jwtResponse.userMail;
        next();
    }catch(err){
        res.status(401).json({message:"Invalid token"});
    }
}
module.exports=jwtMiddleware;