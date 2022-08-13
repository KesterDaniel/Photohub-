const Campground = require("../models/campgrounds")
const Comment = require("../models/comments")

const middlewareObj = {}

middlewareObj.checkCampOwnership = async function(req, res, next) {
    if(req.isAuthenticated()){
        try {
            const foundcampground = await Campground.findById(req.params.id)
            if(foundcampground.Author.id.equals(req.user._id)){
                next()
            }else{
                req.flash("error", "You don't permission to do that")
                res.redirect("back")
            }
        } catch (error) {
            req.flash("error", "Sorry, Campground not found")
            res.redirect("back")
        }
    }else{
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back")
    }
}

middlewareObj.checkCommentOwnerShip = async function(req, res, next){
    if(req.isAuthenticated()){
        try {
            const TheComment = await Comment.findById(req.params.commentid)
            if(TheComment.Author.id.equals(req.user._id)){
                next()
            }else{
                req.flash("error", "You don't permission to do that")
                res.redirect("back")
            }
        } catch (error) {
            req.flash("error", "Comment not found")
            res.redirect("back")
        }
    }else{
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back")
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    req.flash("error", "You need to be logged in to do that")
    res.redirect("/login")
}


module.exports = middlewareObj