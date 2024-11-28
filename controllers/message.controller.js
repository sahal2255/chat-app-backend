const mongoose=require('mongoose');
const User = require('../models/user.model');
const Messages = require('../models/message.model');
const cloudinary=require('../lib/cloudinary')
const getUsersSidebar=async(req,res)=>{
    console.log('message controller')
    try {
        const loggedInUserId=req.user._id;
        const filteredUsers=await User.find({_id:{$ne:loggedInUserId}}).select('-password')
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log('error in the getUserSidebar function',error)
        res.status(500).json({message:'internal server error'})
    }
}
const getMessages=async(req,res)=>{
    try {
        const {id:userToChatId}=req.params
        const userId=req.user._id
        const messages=await Messages.find({
            $or:[
                {senderId:userId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:userId}
            ]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log('error in the get messags route',error)
        res.status(500).json({message:'Internal server error'})
    }
}

const sendMessages=async(req,res)=>{
    try {
        const {text,image}=req.body;
        const {id:receiverId}=req.params;
        const userId=req.user._id;

        let imageUrl;
        if(image){
            const uplaodResponse=await cloudinary.uploader.upload(image)
            imageUrl=uplaodResponse.secure_url
        }
        const newMessage=new Messages({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })

        await newMessage.save()

        //socket.io section

        res.status(201).json(newMessage)
    } catch (error) {
        console.log('error in the send message controller',error)
        res.status(500).json({message:'internal server error'})
    }
}
module.exports={
    getUsersSidebar,
    getMessages,
    sendMessages
}