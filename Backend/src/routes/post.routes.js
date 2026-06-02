const express = require("express");
const postRouter = express.Router();
const postController = require("../controller/post.controller");
const multer = require("multer")
const upload = multer({ storage: multer.memoryStorage() })
const identifyUser = require("../middleware/auth.middleware")






postRouter.post("/create", upload.single('image'), identifyUser,postController.createPostController)
postRouter.get("/", identifyUser,postController.getPostController)
postRouter.get("/details/:postId",identifyUser,postController.getPostDetailsController)
//postRouter.delete("/delete/:postId",identifyUser,postController.deletePostController)
postRouter.post("/like/:postId",identifyUser,postController.likePostController)
//postRouter.post("/unlike/:postId",identifyUser,postController.unlikePostController)




module.exports = postRouter