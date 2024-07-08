const express = require("express")
const connectToDb = require("./database/databaseConnection")
const Blog = require("./model/blogmodel")
const app = express()

connectToDb()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set('view engine','ejs')

app.get("/",(req,res)=>{ //() should be in order req,res while the names can be changed.
    console.log(req)
    res.send("<h1>this home page </h1>")  //'<h1>' is tag while '<h1>Hello World </h1>' is element
})

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

app.post("/createblog", async (req,res)=>{
    // const title = req.body.blog-title
    // const content = req.body.blog-description
    // const subtitle =req.body.blog-subtitle
    const {title, subtitle, description} = req.body
    console.log(title, subtitle, description)
    console.log(req.body)

    await Blog.create({
        title, // title : title,
        subtitle, // subtitle : subtitle,
        description // description : description
    })

    res.send("Post hitted.")

})
app.listen(3000, ()=>{
    console.log("Nodejs project has started at port" + 3000)
})