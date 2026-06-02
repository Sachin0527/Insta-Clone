const userModel = require("../model/user.model")
const followModel = require("../model/follow.model")
const asyncWrapper = require("../utils/aysncWapper")
const ApiError = require("../utils/ApiError")
const ApiResponse = require("../utils/ApiResponse")

const followingUser = asyncWrapper(async(req,res)=>{
   const followeeUsername = req.params.username
   const followerUsername = req.user.username;

   if(followeeUsername == followerUsername){
    throw new ApiError(400,"You cannot follow yourself")
   }
   
   const isFolloweExists = await userModel.findOne({
    username:followeeUsername
   })

   if(!isFolloweExists){
    throw new ApiError(404,"User not found")
   }

   const alreadyFollowing = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername
   })

   if(alreadyFollowing){
    throw new ApiError(409,`Follow request already ${alreadyFollowing.status}`)
   }



   const follow = await followModel.create({
   follower: followerUsername,
   followee: followeeUsername})

    return res.status(201).json( new ApiResponse(201,follow,"You have successfully followed this user"))
    
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

const acceptFollowRequest = asyncWrapper(async(req,res)=>{

    const followeeUsername = req.user.username
    const followerUsername = req.params.username
    const followRequest = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername,
        status: "pending"
    })
    if(!followRequest){
        throw new ApiError(404,"Follow request not found")
    }

    if(followRequest.status !== "pending"){
        throw new ApiError(400,`Follow request already ${followRequest.status}`)
    }
    
    followRequest.status = "accepted"
    await followRequest.save()

    return res.status(200).json( new ApiResponse(200,"You have accepted the follow request",followRequest))
})



module.exports = {
    followingUser,
    unfollowingUser,
    acceptFollowRequest
}
