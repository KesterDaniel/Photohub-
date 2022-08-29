const express = require("express")
const router = new express.Router()
const Photo = require("../models/Photo")
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
        const allphotos = await Photo.find({})
        res.render("index", { photos: allphotos })
    } catch (error) {
        console.log(error)
    }
})

//CREATE ROUTE
router.post("/", middleware.isLoggedIn, upload.single("image"), async(req, res)=>{
    try {
        const result = await cloudinary.uploader.upload(req.file.path) 
        // add cloudinary url for the image to the campground object under image property
        req.body.photo.image = result.secure_url;
        // add author to campground
        req.body.photo.Author = {
          id: req.user._id,
          username: req.user.username
        }
        const photo = await Photo.create(req.body.photo)
        res.redirect(`/photos/${photo.id}`)
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
    const PhotoId = req.params.id
    try {
        const chosenPhoto = await Photo.findById(PhotoId)
        await chosenPhoto.populate("comments")
        res.render("show", {photo: chosenPhoto})
    } catch (error) {
        console.log(error)
    }
})


//UPDATE ROUTES
// router.get("/:id/edit", middleware.checkphotoOwnership, async(req, res)=>{
//     const PhotoId = req.params.id
//     const photo = await Photo.findById(PhotoId)
//     res.render("editCamp", { photo })
// })

// router.put("/:id", middleware.checkphotoOwnership, async(req, res)=>{
//     const updatedPhoto = req.body.photo
//     const id = req.params.id
//     try {
//         await Photo.findByIdAndUpdate(id, updatedPhoto)
//         req.flash("success", "Successfully updated photo!!")
//         res.redirect(`/photos/${id}`)
//     } catch (error) {
//         console.log(error)
//     }
// })


//DELETE ROUTE
router.delete("/:id", middleware.checkphotoOwnership, async(req, res)=>{
    try {
        await Photo.findByIdAndRemove(req.params.id)
        req.flash("success", "Photo successfully deleted!!")
        res.redirect("/photos")
    } catch (error) {
        console.log(error)
    }
}) 




module.exports = router