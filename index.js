//7 import dotenv
require("dotenv").config()//loads .env file contents into process.env by default

//1 import express
const express = require("express")

//5 import cors
const cors=require("cors")

//8 import routes
const router=require("./router")

//11 import connection file
require("./db/connection")

//2 create port
const bookStoreServer = express()

//6 tell server to use cors and cors should only used after creating port
bookStoreServer.use(cors())

//10 parse request
bookStoreServer.use(express.json())

//9 tell server to use router
bookStoreServer.use(router)

bookStoreServer.use("/imgUploads",express.static("./imgUploads"))

//3 create port
const PORT=3000

//4 tell server to listen
bookStoreServer.listen(PORT,()=>{
    console.log(`Bookstore server started running succesfully at port number ${PORT},waiting for client request`);
    
})
//for checking if it working properly
bookStoreServer.get("/",(req,res)=>{
    res.status(200).send(`Bookstore server started running succesfully and waiting for client request`)
})

// bookStoreServer.post("/",(req,res)=>{
//     res.status(200).send(`Post Method`)
// }) 