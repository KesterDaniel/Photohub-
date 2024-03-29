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
const flash = require("connect-flash")
const Photo = require("./models/Photo")
const Comment = require("./models/comments")
const commentRoute = require("./routes/comments")
const indexRoute = require("./routes/index")
const photoRoute = require("./routes/photos")
const port =  process.env.PORT || 3000

//Mongoose connect config
mongoose.connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true
})


//App config
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.use(function(req, res, next){
    res.locals.currentUser = req.user
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next()
})



//Passport Config
passport.use(new LocalStrategy(User.authenticate()))
passport.deserializeUser(User.deserializeUser())
passport.serializeUser(User.serializeUser())

app.use("/photos/:id/comments", commentRoute)
app.use(indexRoute)
app.use("/photos", photoRoute)



app.listen(port, ()=>{
    console.log("Yelp is up")
})