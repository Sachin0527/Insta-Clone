const jwt = require("jsonwebtoken")
const asyncWrapper = require("../utils/aysncWapper");
const ApiError = require("../utils/ApiError");

const identifyUser =asyncWrapper(async(req , res , next)=>{
    const token = req.cookies?.token

    if(!token){
        throw new ApiError(401, "Token not provided, Unauthorized access")
    }
    let decode ;
    try{
        decode= jwt.verify(token , process.env.JWT_SECRET)
    }catch(error){
        throw new ApiError(401, "Unauthorized request");
    }
    req.user = decode ;
    next()
})

module.exports = identifyUser