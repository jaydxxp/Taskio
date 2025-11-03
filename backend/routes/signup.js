const express = require('express');
const router = express.Router();
const z=require("zod")
const User=require("../model/user")
const jwt=require("jsonwebtoken")
const dotenv =require("dotenv")
dotenv.config()
const JWT_SECRET= process.env.jwt;
const signupbody= z.object({
    email:z.string().email(),
    name:z.string(),
    password:z.string().min(3).max(12)
})
router.post("/signup",async (req,res,next)=>
{
    const {success}=signupbody.safeParse(req.body);
    if(!success)
    {
        return res.status(411).json(
            {
                message: "Email already taken / Incorrect inputs"
            }
        )
    }
    const ExistingUser = await User.findOne({
        email: req.body.email
    })
    if(ExistingUser)
    {
        return res.status(411).json({
            message:"Email already taken / Incorrect inputs"
        })
    }
    const user = await User.create({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name
    })
    const userId=user._id
    const token=jwt.sign({
        userId
    },JWT_SECRET);
    const safeUser = { _id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl };
    res.status(200).json({
        message:"User Created Succesfully",
        token:token,
        user: safeUser
    })
})


module.exports=router