const mongoose = require('mongoose')

const followSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "follower id is required for creating an follow"]
    },
    following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "following id is required for creating an follow"]
    }
}, { timestamps: true })

const followModel = mongoose.model("follow", followSchema)

module.exports = followModel
