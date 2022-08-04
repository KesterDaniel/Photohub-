const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const passport = require("passport")
const expressSession = require("express-session")
const passportLocalMongose = require("passport-local-mongoose")
const LocalStrategy = require("passport-local")
const User = require("./models/usermodel")
const Campground = require("./models/campgrounds")
const Comment = require("./models/comments")
const port = 3000 || process.env.PORT 

//Mongoose connect config
mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp', {
    useUnifiedTopology: true
})


//App and passport Config
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(function(req, res, next){
    res.locals.currentUser = req.user
    next()
})


app.use(expressSession({
    secret: "This is yelpcamp Auth session in progress",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.deserializeUser(User.deserializeUser())
passport.serializeUser(User.serializeUser())




//ROOT ROUTE
app.get("/", (req, res)=>{
    res.render("landing")
})

//INDEX ROUTE
app.get("/campgrounds", async(req, res)=>{
    try {
        const allCampgrounds = await Campground.find({})
        res.render("index", { campgrounds: allCampgrounds, currentUser: req.user})
    } catch (error) {
        console.log(error)
    }
})

//CREATE ROUTE
app.post("/campgrounds", async(req, res)=>{
    const name = req.body.name
    const image = req.body.image
    const description = req.body.description
    const newCampground = { name, image, description}
    try {
        await Campground.create(newCampground)
        console.log("CampGround successfully created")
        res.redirect("/campgrounds")
    } catch (error) {
        console.log(error)
    }
})

//NEW ROUTE
app.get("/campgrounds/new", (req, res)=>{
    res.render("new", { currentUser: req.user })
})

//SHOW ROUTE
app.get("/campgrounds/:id", async(req, res)=>{
    const CampId = req.params.id
    try {
        const chosenCamp = await Campground.findById(CampId)
        await chosenCamp.populate("comments")
        res.render("show", {campground: chosenCamp,  currentUser: req.user})
    } catch (error) {
        console.log(error)
    }
})

//==============
//COMMENTS ROUTE
//==============

app.get("/campgrounds/:id/comments/new", isLoggedIn, async(req, res)=>{
    try {
        const campground = await Campground.findById(req.params.id)
        res.render("newComment", { campground,  currentUser: req.user })
    } catch (error) {
        console.log(error)
    }
})

app.post("/campgrounds/:id/comments", async(req, res)=>{
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

//Auth Routes

app.get("/signup", (req, res)=>{
    res.render("signUpForm", { currentUser: req.user })
})

app.post("/signup", async(req, res)=>{
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

app.get("/login", (req, res)=>{
    res.render("loginform", { currentUser: req.user })
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res)=>{

})

app.get("/logout", (req, res, next)=>{
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

app.listen(port, ()=>{
    console.log("Yelp is up")
})