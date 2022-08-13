const express = require("express")
const router = new express.Router()
const Campground = require("../models/campgrounds")
const middleware = require("../middleware")

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
router.post("/", middleware.isLoggedIn, async(req, res)=>{
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
        req.flash("success", "CampGround successfully created")
        res.redirect("/campgrounds")
    } catch (error) {
        console.log(error)
    }
})

//NEW ROUTE
router.get("/new", middleware.isLoggedIn, (req, res)=>{
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


//UPDATE ROUTES
router.get("/:id/edit", middleware.checkCampOwnership, async(req, res)=>{
    const CampId = req.params.id
    const campground = await Campground.findById(CampId)
    res.render("editCamp", { campground })
})

router.put("/:id", middleware.checkCampOwnership, async(req, res)=>{
    const updatedCamp = req.body.campground
    const id = req.params.id
    try {
        await Campground.findByIdAndUpdate(id, updatedCamp)
        req.flash("success", "Successfully updated campground!!")
        res.redirect(`/campgrounds/${id}`)
    } catch (error) {
        console.log(error)
    }
})


//DELETE ROUTE
router.delete("/:id", middleware.checkCampOwnership, async(req, res)=>{
    try {
        await Campground.findByIdAndRemove(req.params.id)
        req.flash("success", "Campground successfully deleted!!")
        res.redirect("/campgrounds")
    } catch (error) {
        console.log(error)
    }
}) 




module.exports = router