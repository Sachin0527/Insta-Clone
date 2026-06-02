const postModel = require("../model/post.model")
const asyncWrapper = require("../utils/aysncWapper")
const ImageKit = require("@imagekit/nodejs")
const { toFile } = require("@imagekit/nodejs")
const jwt = require("jsonwebtoken")
const ApiError = require("../utils/ApiError")
const ApiResponse = require("../utils/ApiResponse")
const likeModel = require("../model/like.model")

const client = new ImageKit({
    privateKey: process.env['IMAGEKIT_PRIVATE_KEY'], // This is the default and can be omitted
});

const createPostController = asyncWrapper(async (req, res) => {
  
    const file = await client.files.upload({
        file: await toFile(Buffer.from(imgUrl.buffer), 'file'),
        fileName: 'test.jpg',
        folder: "insta-clone"
    });


    const post = await postModel.create({
        caption: req.body.caption,
        imgUrl: file.url,
        user: req.user.id
    })

    res.status(201).json(new ApiResponse(201, { message: "Post created successfully", post }));
});

const getPostController = asyncWrapper(async (req, res) => {
   const userId = req.user.id

    const post = await postModel.find({ user: userId })

    if (!post) {
        throw new ApiError(404, { message: "post not found" })
    }

    res.status(200).json(new ApiResponse(200, { message: "Post fetched successfully", post }));
});

const getPostDetailsController = asyncWrapper(async (req, res) => {

const userId = req.user.id;

const postId = req.params.postId;

if (!postId) {
    throw new ApiError(400, "Post ID is required");

}

const post = await postModel.findById(postId);

if (!post) {

    throw new ApiError(404, "Post not found");

}

const isValidUser = post.user.toString() === userId;

if (!isValidUser) {

    throw new ApiError(401, "Unauthorized");

}

res.status(200).json(
    new ApiResponse(
        200,
        {
            message: "Post fetched successfully",
            post
        }
    )
);
})

const likePostController = asyncWrapper(async(req,res)=>{
    const postId = req.params.postId
    const username = req.user.username

    const post = await postModel.findById(postId)
    if(!post){
        throw new ApiError(404,"Post not found")
    }
    const existingLike = await likeModel.findOne({
        userId: req.user.id,
        postId: postId
    })
    
    if(existingLike){
        throw new ApiError(400,"You have already liked this post")
    }
    const like = await likeModel.create({
        userId: req.user.id,
        postId: postId
    })

    return res.status(200).json(new ApiResponse(200,"You have successfully liked this post",like))  
})

module.exports = {
    createPostController,
    getPostController,
    getPostDetailsController,
    likePostController
}