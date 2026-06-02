const express = require('express')
const idenfiyUser = require('../middleware/auth.middleware')
const { followingUser , unfollowingUser} = require('../controller/user.controller')


const userRotuer = express.Router();


/**
 * @route POST /api/users/follow/:userid
 * @description Follow a user
 * @access Private
 */
userRotuer.post('/follow/:username',idenfiyUser,followingUser);

/**
 * @route POST /api/users/follow/:userid
 * @description unFollow a user
 * @access Private
 */

userRotuer.post('/unfollow/:username',idenfiyUser,unfollowingUser);

module.exports =  userRotuer