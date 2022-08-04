const express = require("express")
const router = express.Router()
const passport = require("passport")
const User = require("../models/usermodel")



//ROOT ROUTE
router.get("/", (req, res)=>{
    res.render("landing")
})


//Auth Routes

router.get("/signup", (req, res)=>{
    res.render("signUpForm", { currentUser: req.user })
})

router.post("/signup", async(req, res)=>{
    const username = req.body.username
    const password = req.body.password
    const newUser = new User({username})
    try {
        await User.register(newUser, password)
        await passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds")
        })
    } catch (error) {
        console.log(error)
        res.redirect("/signup")
    }
})

router.get("/login", (req, res)=>{
    res.render("loginform", { currentUser: req.user })
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res)=>{

})

router.get("/logout", (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        res.redirect("/campgrounds")
    })
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

module.exports = router