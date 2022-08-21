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
    res.render("signUpForm")
})

router.post("/signup", async(req, res)=>{
    const username = req.body.username
    const password = req.body.password
    const newUser = new User({username})
    try {
        await User.register(newUser, password)
        await passport.authenticate("local")(req, res, function(){
            req.flash("success", `Successfully signed up. Welcome here ${username}`)
            res.redirect("/photos")
        })
    } catch (error) {
        console.log(error)
        req.flash("error", error.message)
        res.redirect("/signup")
    }
})

router.get("/login", (req, res)=>{
    res.render("loginform")
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/photos",
    failureRedirect: "/login"
}), (req, res)=>{

})

router.get("/logout", (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success", "Logged you out. See you next time")
        res.redirect("/photos")
    })
})


module.exports = router