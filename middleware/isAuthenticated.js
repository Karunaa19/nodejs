const jwt=require(jsonwebtoken)
const isAthenticated=(req,res,next)=>{
    const token=req.cookies.token
    console.log(token)
    if(token ||token==null){
        return res.send("please login")
    }
    jwt.verify(token,process.env.SECRET,token, =>{
        if(err){
            res.send("Invalid token")
        }
        else{
            const data=await UserActivation.user.findById(result.userid)
            console,log("valid token",result)
        }
        if(!data){
            res.send("invalid userId in the token")
        }
        else{
            req.userId=result.userId
            next()
        }
    })
    next()
}