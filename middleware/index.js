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
                res.send("You dont have permission to do that")
            }
        } catch (error) {
            res.redirect("back")
        }
    }else{
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
                res.send("you dont have permission to do that")
            }
        } catch (error) {
            res.redirect("back")
        }
    }else{
        res.redirect("back")
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}


module.exports = middlewareObj