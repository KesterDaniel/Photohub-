const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const passport = require("passport")
const expressSession = require("express-session")
const passportLocalMongose = require("passport-local-mongoose")
const LocalStrategy = require("passport-local")
const User = require("./models/usermodel")
const Campground = require("./models/campgrounds")
const Comment = require("./models/comments")
const commentRoute = require("./routes/comments")
const indexRoute = require("./routes/index")
const campgroundRoute = require("./routes/campgrounds")
const port = 3000 || process.env.PORT 

//Mongoose connect config
mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp', {
    useUnifiedTopology: true
})


//App config
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.use(expressSession({
    secret: "This is yelpcamp Auth session in progress",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(function(req, res, next){
    res.locals.currentUser = req.user
    next()
})

//Passport Config
passport.use(new LocalStrategy(User.authenticate()))
passport.deserializeUser(User.deserializeUser())
passport.serializeUser(User.serializeUser())

app.use("/campgrounds/:id/comments", commentRoute)
app.use(indexRoute)
app.use("/campgrounds", campgroundRoute)



app.listen(port, ()=>{
    console.log("Yelp is up")
})