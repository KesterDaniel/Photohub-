const express = require("express")
const router = new express.Router({mergeParams: true})
const Campground = require("../models/campgrounds")
const Comment = require("../models/comments")


router.get("/new", isLoggedIn, async(req, res)=>{
    try {
        const campground = await Campground.findById(req.params.id)
        res.render("newComment", { campground })
    } catch (error) {
        console.log(error)
    }
})

router.post("/", isLoggedIn, async(req, res)=>{
    const newComment = req.body.comment
    const campId = req.params.id
    try {
       const MyComment = await Comment.create(newComment)
       const camp = await Campground.findById(campId)
       await camp.comments.push(MyComment)
       await camp.save()
       res.redirect(`/campgrounds/${campId}`)
       console.log("added comment")
    } catch (error) {
        res.redirect("/campgrounds")
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