require("dotenv").config()
const express = require("express")
const connectToDb = require("./database/databaseConnection")
const Blog = require("./model/blogModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const app = express()
const cookieParser = require('cookie-parser')
app.use(cookieParser())

const {multer,storage}= require('./middleware/multerConfig')
const isAuthenticated = require('./middleware/isAuthenticated')
const User = require('./model/userModel')
const upload = multer({storage : storage})

connectToDb()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set('view engine','ejs')

// app.get("/",(req,res)=>{ //() should be in order req,res while the names can be changed.
//     console.log(req)
//     res.send("<h1>huhu this is home page </h1>")  //'<h1>' is tag while '<h1>Hello World </h1>' is element
// })

// app.get("/", async(req,res)=>{
//     const { search } = req.query; 
//     let Blogs;
//     if (search) {
//         Blogs = await Blog.find({
//             $or: [{ title: { $regex: search, $options: "i" } }]
//         });
//     } 
//     else {    Blogs = await Blog.find() //always returns array
//     console.log(Blogs)
//     if (Blogs.length === 0){
//         res.send("NO BLOGS")
//     }
//     res.render("home.ejs", {Blogs, search})     
//     }

// })

app.get("/", async (req, res) => {
    const { search } = req.query;
    let Blogs;
    if (search) {
        Blogs = await Blog.find({
            $or: [{ title: { $regex: search, $options: "i" } }, { content: { $regex: search, $options: "i" } }]
        });
    } else {
        Blogs = await Blog.find();
        if (Blogs.length === 0){
        res.send("NO BLOGS<br /><a href='/register'>Register</a>&nbsp;<a href='/createblog'>Create blog</a>" )
        }
    }
    res.render("home.ejs", { Blogs, search, userId: req.cookies.token ? true : false});
});
app.get("/about",(req,res)=>{ 
    const about = "about"
    res.render("about.ejs", {about}) 
    })
app.get("/contact",(req,res)=>{ 
    const contact = "contact"
    res.render("contact.ejs", {contact}) 
})
app.get("/register",(req,res)=>{ 
    const register = "register"
    res.render("register.ejs", {register, userId: req.cookies.token ? true : false})  
})
 

app.post("/register", async (req,res)=>{
    const {username, email, password} = req.body
    await User.create({
        username : username,
        email : email,
        password: bcrypt.hashSync(password,12) //password : password
    })
    res.redirect("/login")
})

app.get("/login",(req,res)=>{ 
    const login = "login"
    res.render("login.ejs", {login, userId: req.cookies.token ? true : false})  
})

app.post("/login", async (req,res)=>{
    const {email, password} = req.body
    // const data = await User.find({
    //     email,
    //     password
    //  })
    //     if (data.length ===0){
    //         res.send("Invalid email or password")
    //     }
    //     else{
    //         res.send("Logged in")
    //     }

    const user = await User.find({email})  //find gives array and findOne gives object
        if (user.length ===0){
            res.send("Invalid email")
        }
        else{
           const isMatched = bcrypt.compareSync(password, user[0].password )  // user[0] for find and user for findOne
           if(!isMatched) {
                res.send("Invalid password")
            }
            else{
                const token = jwt.sign({userId : user[0]._id}, process.env.secret,{
                    expiresIn : "20d"
                })
                res.cookie("token",token)
                res.redirect("/")
           }
        }
})

app.get('/logout', (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
  });

  

app.get("/blog/:id", async (req,res)=>{
    // console.log(req.params.id)
    const id = req.params.id
    const blog = await Blog.findById(id).populate('author')
    console.log(blog)
    res.render("blog.ejs", {blog, userId: req.cookies.token ? true : false})
})

app.get("/createblog", isAuthenticated, (req,res)=>{
    const create = "createblog"
    res.render("createblog.ejs", {create, userId: req.cookies.token ? true : false})
})


app.post("/createblog",  isAuthenticated, upload.single('image'), async (req,res)=>{
    // const title = req.body.blog-title
    // const content = req.body.blog-description
    // const subtitle =req.body.blog-subtitle
    const fileName = req.file.filename
    const userid= req.userId

    // console.log("fileName", req.file)
    const {title, subtitle, description} = req.body
    console.log(title, subtitle, description, userid)

    await Blog.create({
        title, // title : title,
        subtitle, // subtitle : subtitle,
        description, // description : description
        image : fileName,
        author : userid
    })

     res.send("Blog created successfully.<br /><a href='/'>Go to home</a>&nbsp;<a href='/createblog'>Create another blog</a>" )
})


app.get("/editblog/:id", async (req,res)=>{
    const id = req.params.id
    const blog = await Blog.findById(id)
    res.render("edit.ejs", {blog, userId: req.cookies.token ? true : false})
})

app.post("/editblog/:id", upload.single('image'), async (req,res)=>{
    const id = req.params.id
    const {title, subtitle, description} = req.body
    const fileName = req.file.filename
    await Blog.findByIdAndUpdate(id,{
        title, 
        subtitle,
        description,
        image : fileName
    })
    res.redirect("/blog/" + id)
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