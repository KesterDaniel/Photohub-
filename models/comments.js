const mongoose = require("mongoose")


const CommentSchema = new mongoose.Schema({
    text: String,
    Author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
})

const Comment = mongoose.model("Comment", CommentSchema)

module.exports = Comment