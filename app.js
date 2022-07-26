const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const port = 3000 || process.env.PORT 

const Campground = require("./models/campgrounds")
const seedDb = require("./seeds")

mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp', {
    useUnifiedTopology: true
})

seedDb() 




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
        console.log(chosenCamp)
        res.render("show", {campground: chosenCamp})
    } catch (error) {
        console.log(error)
    }
})

app.listen(port, ()=>{
    console.log("Yelp is up")
})