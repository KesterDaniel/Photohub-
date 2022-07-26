const mongoose = require("mongoose")
const CampgroundSchema = mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
})

const Campground = mongoose.model("campground", CampgroundSchema)

module.exports = Campground