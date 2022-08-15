const express = require("express")
const router = new express.Router()
const Campground = require("../models/campgrounds")
const middleware = require("../middleware")

var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'do1xoszkp', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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
router.post("/", middleware.isLoggedIn, upload.single("image"), async(req, res)=>{
    try {
        const result = await cloudinary.uploader.upload(req.file.path) 
        // add cloudinary url for the image to the campground object under image property
        req.body.campground.image = result.secure_url;
        // add author to campground
        req.body.campground.Author = {
          id: req.user._id,
          username: req.user.username
        }
        const campground = await Campground.create(req.body.campground)
        res.redirect(`/campgrounds/${campground.id}`)
    } catch (error) {
        req.flash("error", error.message)
        res.redirect("back")
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