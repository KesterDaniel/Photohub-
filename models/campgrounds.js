const mongoose = require("mongoose")
const CampgroundSchema = mongoose.Schema({
    name: String,
    image: String,
    description: String,
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
    price : Number
})

const Campground = mongoose.model("campground", CampgroundSchema)

module.exports = Campground