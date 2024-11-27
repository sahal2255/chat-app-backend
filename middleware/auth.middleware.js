const jwt=require('jsonwebtoken')

const User =require('../models/user.model')

const protected=async(req,res,next)=>{
    try {
        const token=req.cookies.jwt

        if(!token){
            return res.status(401).json({message:'Unautherized -No Token Provided'})
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({message:'Unautherized -Token Expired'})
        }
        const user=await User.findById(decoded.userId).select('-password')
        if(!user){
            return res.status(404).json({message:'User Not Found'})
        }
        req.user=user
        next()
    } catch (error) {
        console.log('authentication error',error)
        res.status(500).json({message:'Internal server error'})
    }
}

module.exports=protected