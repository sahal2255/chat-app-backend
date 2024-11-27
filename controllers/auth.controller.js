const User = require("../models/user.model")
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const generateToken = require("../lib/token")

const signup=async(req,res)=>{
    console.log('hitting the route')
    console.log('body',req.body)
    const {fullName,email,password}=req.body
    try {
        if(!fullName || !email ||!password){
            return res.status(400).json({message:'All fields are required '})
        }
        if(password.length<6){
            return res.status(400).json({message:'Password Must be atleast 6 character'})
        }
        const user=await User.findOne({email})
        if(user){
            return res.status(400).json({message :'Email Already existed'})
        }
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt) 

        const newUser=new User({
            fullName,
            email,
            password:hashedPassword,
        })
        if(newUser){
            generateToken(newUser._id,res)
            await newUser.save()
            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic
            })
        }else{
            res.status(400).json({message:'Invalid User Data'})
        }
    } catch (error) {
        console.log('error in signup controller',error.message)
        res.status(500).json({message:'internal server error'})
    }
}

const login=async(req,res)=>{
    const {email,password}=req.body
    try {
        if(!email || !password){
            return res.status(400).json({message:'all fields are required'})
        }
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:'invalid'})
        }
        const isPasswordValid=await bcrypt.compare(password,user.password)
        if(!isPasswordValid){
            return res.status(400).json({message:'Password is incorrect'})
        }
        generateToken(user._id,res)
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic
        })
    } catch (error) {
        console.log('error in the login controller',error)
        res.status(500).json({message:'internal server error'})
    }
}

const logout=(req,res)=>{
    try {
        res.cookie('jwt','',{maxAge:0})
        res.status(200).json({message:'Logout Successfully'})
    } catch (error) {
        console.log('error in the logout controller')
        res.status(500).json({message:'internal server error'})
    }
}

const updateProfile=async(req,res)=>{
    console.log('htting the update profile route')
    
}

module.exports={signup,login,logout,updateProfile}