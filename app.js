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
    image: String
})

const Campground = mongoose.model("campground", CampgroundSchema)

// async function TestCamp(){
//     try {
//         const MyCamp = await Campground.create({
//             name: "Salmona creek",
//             image: "https://pixabay.com/get/ga9b3e521a9e485904f749a384cfccff35a58c3e992a624cceda5140b9d03f5386c6c4b3abc1f8dcb168b1f9c24ab9d4a_340.jpg",
//         })
//         console.log("Newly Created Campground: ")
//         console.log(MyCamp)
//     } catch (error) {
//         console.log(error)
//     }
// }

// TestCamp()

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))

 
app.get("/", (req, res)=>{
    res.render("landing")
})

app.get("/campgrounds", async(req, res)=>{
    try {
        const allCampgrounds = await Campground.find({})
        res.render("campgrounds", { campgrounds: allCampgrounds })
    } catch (error) {
        console.log(error)
    }
})

app.post("/campgrounds", async(req, res)=>{
    const name = req.body.name
    const image = req.body.image
    const newCampground = { name, image}
    try {
        await Campground.create(newCampground)
        console.log("CampGround successfully created")
        res.redirect("/campgrounds")
    } catch (error) {
        console.log(error)
    }
})

app.get("/campgrounds/new", (req, res)=>{
    res.render("new")
})

app.listen(port, ()=>{
    console.log("Yelp is up")
})