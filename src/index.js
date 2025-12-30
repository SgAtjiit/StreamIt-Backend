// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT||8000

connectDB()
.then(()=>{
  app.listen(port,()=>{
    console.log(`Server is running at port:${port} `,)
  })
})
.catch((error)=>{
  console.log("Mongodb connection failed!!",error)
})
// import express from "express"
// const app = express()
// (async ()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("eroor",(error)=>{
//             console.log("Error : ",error)
//             throw err
//         })

//         app.listen(process.env.PORT, ()=>{
//             console.log(`App is listening on port ${process.env.PORT}`)
//         })
//     } catch (error) {
//         console.error("Error occured while connecting to db:",error)
//         throw err
//     }
// })()
