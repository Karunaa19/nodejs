const express = require("express")
const connectToDb = require("./database/databaseConnection")
const Blog = require("./model/blogmodel")
const app = express()
// required("./middleware")
const {multer,storage}=require('./middleware/multerConfig')
const upload =multer({storage : storage})


connectToDb()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set('view engine','ejs')

// app.get("/",(req,res)=>{ //() should be in order req,res while the names can be changed.
//     console.log(req)
//     res.send("<h1>this home page </h1>")  //'<h1>' is tag while '<h1>Hello World </h1>' is element
// })

app.get("/about",(req,res)=>{ 
    const name= "karuna"
    res.render("about.ejs", {name})  //{name : name}
})

app.get("/contact",(req,res)=>{
    const contact= "Contact"
    res.render("contact.ejs", {contact})
})

app.get("/createblog",(req,res)=>{
    const create = "createblog"
    res.render("createblog.ejs", {create})
})

app.post("/createblog",upload.single('image'), async (req,res)=>{
    // const title = req.body.blog-title
    // const content = req.body.blog-description
    // const subtitle =req.body.blog-subtitle
    const {title, subtitle, description} = req.body
    const filename=req.file.filename;
    console.log(title, subtitle, description)
    console.log(req.body)

   const blog= await Blog.create({
        title, // title : title,
        subtitle, // subtitle : subtitle,
        description, // description : description
         image: filename
    })
 
    // .render

   res.status(201).json({
    success:true,
    message:"Blog created sucessfully!",
    data:blog
   })

})
// app.get("/home",(req,res)=>{
//     const create = "home"
//     res.render("home.ejs", {create})
// })
app.get("/",async(req,res)=>{
    const blogs=await Blog.find();
    res.render("home.ejs",{blogs})
}
)
app.use(express.static("./storage"))
app.listen(3000, ()=>{
    console.log("Nodejs project has started at port" + 3000)
})