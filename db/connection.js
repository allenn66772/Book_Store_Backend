const mongoose=require("mongoose") //mongoose do connect and parse
const connectionString=process.env.DATABASE

mongoose.connect(connectionString).then(res=>{
    console.log("MongoDB connected succesfully");
    
}).catch(err=>{
    console.log(`MongoDB connection failed due to: ${err}`);
    
})