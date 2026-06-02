const userModel = require("../model/user.model")
const followModel = require("../model/follow.model")
const asyncWrapper = require("../utils/aysncWapper")
const ApiError = require("../utils/ApiError")
const ApiResponse = require("../utils/ApiResponse")

const followingUser = asyncWrapper(async(req,res)=>{
   const followeeUsername = req.params.username
   const followerUsername = req.user.username;
   console.log(followeeUsername,followerUsername)

   if(followeeUsername == followerUsername){
    throw new ApiError(400,"You cannot follow yourself")
   }
   
   const isFolloweExists = await userModel.findOne({
    username:followeeUsername
   })

   if(isFolloweExists){
    throw new ApiError(400,"You already followed this user")
   }

   const alreadyFollowing = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername
   })

   if(alreadyFollowing){
    throw new ApiError(400,"You already followed this user")
   }



   const follow = await followModel.create({
   follower: followerUsername,
   followee: followeeUsername})

    return res.status(200).json( new ApiResponse(200,"You have successfully followed this user",follow))
    
})  

const unfollowingUser = asyncWrapper(async(req,res)=>{

    const followeeUsername = req.params.username
    const followerUsername = req.user.username

    const isUserFollowing = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })
    if(!isUserFollowing){
         throw new ApiError(400,"You are not following this user")
      }

    const follow = await followModel.findByIdAndDelete(isUserFollowing._id)

    return res.status(200).json( new ApiResponse(200,"You have successfully unfollowed this user",follow))
    
})



module.exports = {
    followingUser,
    unfollowingUser,
}
