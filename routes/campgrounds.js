const express = require("express")
const router = new express.Router()
const Campground = require("../models/campgrounds")

//INDEX ROUTE
router.get("/", async(req, res)=>{
    try {
        const allCampgrounds = await Campground.find({})
        res.render("index", { campgrounds: allCampgrounds})
    } catch (error) {
        console.log(error)
    }
})

//CREATE ROUTE
router.post("/", isLoggedIn, async(req, res)=>{
    const name = req.body.name
    const image = req.body.image
    const description = req.body.description
    const Author = {
        id: req.user._id,
        username: req.user.username
    }
    const newCampground = { name, image, description, Author}
    try {
        await Campground.create(newCampground)
        console.log("CampGround successfully created")
        res.redirect("/campgrounds")
    } catch (error) {
        console.log(error)
    }
})

//NEW ROUTE
router.get("/new", isLoggedIn, (req, res)=>{
    res.render("new")
})

//SHOW ROUTE
router.get("/:id", async(req, res)=>{
    const CampId = req.params.id
    try {
        const chosenCamp = await Campground.findById(CampId)
        await chosenCamp.populate("comments")
        res.render("show", {campground: chosenCamp})
    } catch (error) {
        console.log(error)
    }
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

module.exports = router