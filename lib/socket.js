const {Server}=require('socket.io')
const http =require('http')
const express=require('express')

const app=express()

const server=http.createServer(app)

const io=new Server(server,{
    cors:{
        origin:['http://localhost:5173']
    }
})

const getMessageSocketId=(userId)=>{
    return onlineUsers[userId]
}

const onlineUsers={}
io.on('connection',(socket)=>{
    console.log('a user connected',socket.id)
    const userId=socket.handshake.query.userId

    if(userId) onlineUsers[userId]=socket.id

    io.emit('getOnlineUsers',Object.keys(onlineUsers))
    socket.on('disconnect',()=>{
        console.log('a user is disconnected',socket.id)
        delete onlineUsers[userId];
        io.emit('getOnlineUsers',Object.keys(onlineUsers))
    })
})

module.exports={io , app , server,onlineUsers ,getMessageSocketId}