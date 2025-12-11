const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profile:{
        type:String,
        default:""
    },
    bio:{
        type:String,
        default:"BookStore User"
    },
    role:{
        type:String,
        default:"user"
    }
})
//name should be same(here it is users)
const users=mongoose.model("users",userSchema)
module.exports=users