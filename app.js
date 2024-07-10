const express = require("express")
const connectToDb = require("./database/databaseConnection")
const Blog = require("./model/blogmodel")
const app = express()
const {multer,storage}= require('./middleware/multerConfig')
const upload = multer({storage : storage})

connectToDb()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set('view engine','ejs')

// app.get("/",(req,res)=>{ //() should be in order req,res while the names can be changed.
//     console.log(req)
//     res.send("<h1>huhu this is home page </h1>")  //'<h1>' is tag while '<h1>Hello World </h1>' is element
// })

app.get("/", async(req,res)=>{
    const Blogs = await Blog.find() //always returns array
    console.log(Blogs)
    if (Blogs.length === 0){
        res.send("NO BLOGS")
    }
    res.render("home.ejs", {Blogs})
})

app.get("/about",(req,res)=>{ 
    const name= "Karuna"
    res.render("about.ejs", {name})  //{name : name}
})

app.get("/contact",(req,res)=>{
    const contact= "Contact"
    res.render("contact.ejs", {contact})
})

app.get("/blog/:id", async (req,res)=>{
    // console.log(req.params.id)
    const id = req.params.id
    const blog = await Blog.findById(id)
    res.render("blog.ejs", {blog})
})

app.get("/createblog",(req,res)=>{
    const create = "createblog"
    res.render("createblog.ejs", {create})
})


app.post("/createblog", upload.single('image'), async (req,res)=>{
    // const title = req.body.blog-title
    // const content = req.body.blog-description
    // const subtitle =req.body.blog-subtitle
    const fileName = req.file.filename
    // console.log("fileName", req.file)
    const {title, subtitle, description} = req.body
    console.log(title, subtitle, description)

    await Blog.create({
        title, // title : title,
        subtitle, // subtitle : subtitle,
        description, // description : description
        image : fileName
    })

    res.send("Blog created successfully.")

})


app.get("/editblog/:id", async (req,res)=>{
    // console.log(req.params.id)
    const id = req.params.id
    const blog = await Blog.findByIdAndUpdate(id)
    res.render("editBlog.ejs", {blog})
})


app.get("/deleteblog/:id", async (req,res)=>{
    const id = req.params.id
    const blog = await Blog.findByIdAndDelete(id) 
    res.redirect("/")
})

app.use(express.static("./storage"))

app.listen(3000, ()=>{
    console.log("Nodejs project has started at port " + 3000)
})