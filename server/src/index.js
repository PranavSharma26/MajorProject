import express from 'express'
import dotenv from 'dotenv'
import { dbConnect } from './config/db.js'
import signupRoute from './routes/signup.js'

dotenv.config()

const app = express()
const port=process.env.PORT || 3001
app.use(express.json())

await dbConnect()

app.get('/',(req,res)=>{
    res.send("Hi this is / page")
})

app.use('/api',signupRoute)

app.listen(port, ()=>{
    console.log(`Server is listening on port: ${port}`)
})