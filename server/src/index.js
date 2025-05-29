import express from 'express'
import dotenv from 'dotenv'
import { dbConnect } from './config/db.js'

dotenv.config()

const app = express()
const port=process.env.PORT || 3001

await dbConnect()

app.get('/',(req,res)=>{
    res.send("Hi this is / page")
})

app.listen(port, ()=>{
    console.log(`Server is listening on port: ${port}`)
})