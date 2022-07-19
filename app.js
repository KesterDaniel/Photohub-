const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const port = 3000 || process.env.PORT 

mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp', {
    useUnifiedTopology: true
})

const CampgroundSchema = mongoose.Schema({
    name: String,
    image: String,
    description: String
})

const Campground = mongoose.model("campground", CampgroundSchema)

// async function NewCamp(){
//     try {
//         const camp = await Campground.create({
//             name: "Dreaded Hill", 
//             image: "https://pixabay.com/get/g9bc057ccee42b6646a4417406906446f0d95db666ca6dc87a7f13cd489a1e3a7b9539c701db323e227cd946058399f22_340.jpg",
//             description: "A very deadly morgage trench following the demise of the the great warlord in the ancient times. U dont wanna mess around here. ha ha ha!!"
//         })
//         console.log("campground successfully created...")
//         console.log(camp)
//     } catch (error) {
//         console.log(error)
//     }
// }

// NewCamp()

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
        res.render("show", {campground: chosenCamp})
    } catch (error) {
        console.log(error)
    }
})

app.listen(port, ()=>{
    console.log("Yelp is up")
})