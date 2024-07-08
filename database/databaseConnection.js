const mongoose=require("mongoose")
// import 'mangoose'
async function connectTodb(){

    await mongoose.connect("mongodb+srv://noname:anitaram@cluster0.d3qrugx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    console.log("Database connected")
}
module.exports=connectTodb
// export default mangoose