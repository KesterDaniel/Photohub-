const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const port = 3000 || process.env.PORT 
 

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))

const campgrounds = [
    {Name: "Nyt Joy", image: "https://pixabay.com/get/g036b71c651efd8e26c5e9a03f643c491868661cb0a4b3eba5bb74c01d3c110efacb473a28e1bb688cbc1273a3800ebdd_340.jpg"},
    {Name: "Salmona creek", image: "https://pixabay.com/get/g605494ed882c0664720135b32e645ce8e73fee1e94f9f7d2a79fada4d7f6938e8296cff9c996c5625d0f02e20919dd9b_340.jpg"},
    {Name: "Shadow lights", image: "https://pixabay.com/get/g8f6689264482d1631bb1211faea41a65b2f53eca22cd76fa8082e63caf5e4ad424b38a507999689abf36eb0cc27f796f_340.jpg"},
    {Name: "Nyt Joy", image: "https://pixabay.com/get/g036b71c651efd8e26c5e9a03f643c491868661cb0a4b3eba5bb74c01d3c110efacb473a28e1bb688cbc1273a3800ebdd_340.jpg"},
    {Name: "Salmona creek", image: "https://pixabay.com/get/g605494ed882c0664720135b32e645ce8e73fee1e94f9f7d2a79fada4d7f6938e8296cff9c996c5625d0f02e20919dd9b_340.jpg"},
    {Name: "Shadow lights", image: "https://pixabay.com/get/g8f6689264482d1631bb1211faea41a65b2f53eca22cd76fa8082e63caf5e4ad424b38a507999689abf36eb0cc27f796f_340.jpg"},
    {Name: "Nyt Joy", image: "https://pixabay.com/get/g036b71c651efd8e26c5e9a03f643c491868661cb0a4b3eba5bb74c01d3c110efacb473a28e1bb688cbc1273a3800ebdd_340.jpg"},
    {Name: "Salmona creek", image: "https://pixabay.com/get/g605494ed882c0664720135b32e645ce8e73fee1e94f9f7d2a79fada4d7f6938e8296cff9c996c5625d0f02e20919dd9b_340.jpg"},
    {Name: "Shadow lights", image: "https://pixabay.com/get/g8f6689264482d1631bb1211faea41a65b2f53eca22cd76fa8082e63caf5e4ad424b38a507999689abf36eb0cc27f796f_340.jpg"},
]
 
app.get("/", (req, res)=>{
    res.render("landing")
})

app.get("/campgrounds", (req, res)=>{
    res.render("campgrounds", { campgrounds })
})

app.post("/campgrounds", (req, res)=>{
    const Name = req.body.Name
    const image = req.body.image
    const newCampground = { Name, image}
    campgrounds.push(newCampground)
    res.redirect("/campgrounds")
})

app.get("/campgrounds/new", (req, res)=>{
    res.render("new")
})

app.listen(port, ()=>{
    console.log("Yelp is up")
})