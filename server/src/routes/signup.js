import express from 'express'
import bcrypt from 'bcrypt'
import { getDB } from '../config/db.js'
import { insertUser, isPhoneNoExist } from '../functions/function.js'

const router = express.Router()

router.post('/signup', async (req,res)=>{
    try {
        let db = await getDB()
        const {firstName, lastName, age, phoneNo, subscription, password} = req.body
        if(await isPhoneNoExist(phoneNo,db)){
            return res.status(400).json({message:"User from this phone number already exists"})
        }
        const hashedPassword = await bcrypt.hash(password,10)
    
        const credentials = {firstName, lastName, age, phoneNo, subscription, hashedPassword}
        
        return (await insertUser(credentials,db)) ?
        res.status(201).json({message:"User Signed Up Successfully"}) :
        res.status(400).json({message:"Error Signing Up"})
        
    } catch (err) {
        console.log("Internal Servel Error", err)
        return res.status(500).json({error:"Internal Server Error"})
    }
})

export default router