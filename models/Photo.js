const mongoose = require("mongoose")
const PhotoSchema = mongoose.Schema({
    image: String,
    caption: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    Author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
})

const Photo = mongoose.model("photo", PhotoSchema)

module.exports = Photo