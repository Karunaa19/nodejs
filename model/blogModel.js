const mongoose = require("mongoose")
const Schema = mongoose.Schema

const blogSchema = new Schema({
    title : {
        type : String
    },
    subtitle:{
        type : String
    },
    description :{
        type : String
    },
    image: {
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Blog = mongoose.model("Blog", blogSchema) //it becomes Blogs
module.exports = Blog
