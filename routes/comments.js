const express = require("express")
const router = new express.Router({mergeParams: true})
const Photo = require("../models/Photo")
const Comment = require("../models/comments")
const middleware = require("../middleware")
 


router.get("/new", middleware.isLoggedIn, async(req, res)=>{
    try {
        const photo = await Photo.findById(req.params.id)
        res.render("newComment", { photo })
    } catch (error) {
        console.log(error)
    }
})

router.post("/", middleware.isLoggedIn, async(req, res)=>{
    const newComment = req.body.comment
    const photoId = req.params.id
    try {
       const MyComment = await Comment.create(newComment)
       const photo = await Photo.findById(photoId)
       MyComment.Author.id = req.user._id
       MyComment.Author.username = req.user.username
       await MyComment.save()
       await photo.comments.push(MyComment)
       await photo.save()
       req.flash("success", "Added comment successfully!")
       res.redirect(`/photos/${photoId}`)
    } catch (error) {
        res.redirect("/photos")
        console.log(error)
    }
})

router.get("/:commentid/edit", middleware.checkCommentOwnerShip, async(req, res)=>{
    const photoId = req.params.id
    const commentId = req.params.commentid
    try {
        const badcomment = await Comment.findById(commentId)
        res.render("editComment", { badcomment, photoId })
    } catch (error) {
        res.redirect("back")
    }
})

router.put("/:commentid", middleware.checkCommentOwnerShip, async(req, res)=>{
    const photoId = req.params.id
    const commentId = req.params.commentid
    const newComment = req.body.comment
    try {
        await Comment.findByIdAndUpdate(commentId, newComment)
        req.flash("success", "Comment successfully updated!!")
        res.redirect(`/photos/${photoId}`)
    } catch (error) {
        res.redirect("back")
    }
})

router.delete("/:commentid", middleware.checkCommentOwnerShip, async(req, res)=>{
    const commentId = req.params.commentid
    const photoId = req.params.id
    try {
        await Comment.findByIdAndRemove(commentId)
        req.flash("success", "Comment deleted")
        res.redirect(`/photos/${photoId}`)
    } catch (error) {
        res.redirect("back")
    }
})





module.exports = router