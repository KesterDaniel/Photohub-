const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const port = 3000 || process.env.PORT 

const Campground = require("./models/campgrounds")
const Comment = require("./models/comments")


mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp', {
    useUnifiedTopology: true
})



app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))




//ROOT ROUTE
app.get("/", (req, res)=>{
    res.render("landing")
})

//INDEX ROUTE
app.get("/campgrounds", async(req, res)=>{
    try {
        const allCampgrounds = await Campground.find({})
        res.render("index", { campgrounds: allCampgrounds })
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
    res.render("new")
})

//SHOW ROUTE
app.get("/campgrounds/:id", async(req, res)=>{
    const CampId = req.params.id
    try {
        const chosenCamp = await Campground.findById(CampId)
        await chosenCamp.populate("comments")
        res.render("show", {campground: chosenCamp})
    } catch (error) {
        console.log(error)
    }
})

//==============
//COMMENTS ROUTE
//==============

app.get("/campgrounds/:id/comments/new", async(req, res)=>{
    try {
        const campground = await Campground.findById(req.params.id)
        res.render("newComment", { campground })
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


app.listen(port, ()=>{
    console.log("Yelp is up")
})