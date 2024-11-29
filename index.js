const express=require('express')
const authRoute =require('./routes/auth.route.js')
const dotenv=require('dotenv');
const connectDB  = require('./lib/db.js');
const cookieParser=require('cookie-parser')
const messageRoute=require('./routes/message.route.js')
const cors=require('cors')
dotenv.config()

const app=express();

const PORT=process.env.PORT

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

app.use('/api/auth',authRoute);
app.use('/api/message',messageRoute)

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
    connectDB()
})