
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req,res,next) => {
    try{
        const token = req.cookies.token
                        || req.body.token
                        || req.header("Authorisation").replace("Bearer ","");
        
        // if token missing then return res
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token missing"
            });
        }

        //verify the token
        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode;
        }catch(error){
            return res.status(403).json({
                success:false,
                message:"Token is invalid"
            });
        }
        next();

    }catch(error){
        return res.status(401).json({
            success:false,
            message:"Something went wrong while validating the token"
        });
    }
}