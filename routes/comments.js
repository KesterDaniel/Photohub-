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
       MyComment.Author.id = req.user._id
       MyComment.Author.username = req.user.username
       await MyComment.save()
       await camp.comments.push(MyComment)
       await camp.save()
       res.redirect(`/campgrounds/${campId}`)
    } catch (error) {
        res.redirect("/campgrounds")
        console.log(error)
    }
})

router.get("/:commentid/edit", checkCommentOwnerShip, async(req, res)=>{
    const campId = req.params.id
    const commentId = req.params.commentid
    try {
        const badcomment = await Comment.findById(commentId)
        res.render("editComment", { badcomment, campId })
    } catch (error) {
        res.redirect("back")
    }
})

router.put("/:commentid", checkCommentOwnerShip, async(req, res)=>{
    const campId = req.params.id
    const commentId = req.params.commentid
    const newComment = req.body.comment
    try {
        await Comment.findByIdAndUpdate(commentId, newComment)
        res.redirect(`/campgrounds/${campId}`)
    } catch (error) {
        res.redirect("back")
    }
})

router.delete("/:commentid", checkCommentOwnerShip, async(req, res)=>{
    const commentId = req.params.commentid
    const campId = req.params.id
    try {
        await Comment.findByIdAndRemove(commentId)
        res.redirect(`/campgrounds/${campId}`)
    } catch (error) {
        res.redirect("back")
    }
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

async function checkCommentOwnerShip(req, res, next){
    if(req.isAuthenticated()){
        try {
            const TheComment = await Comment.findById(req.params.commentid)
            if(TheComment.Author.id.equals(req.user._id)){
                next()
            }else{
                res.send("you dont have permission to do that")
            }
        } catch (error) {
            res.redirect("back")
        }
    }else{
        res.redirect("back")
    }
}

module.exports = router