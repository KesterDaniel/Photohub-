const mongoose = require("mongoose")
const CampgroundSchema = mongoose.Schema({
    name: String,
    image: String,
    description: String
})

const Campground = mongoose.model("campground", CampgroundSchema)

module.exports = Campground