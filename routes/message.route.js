const express = require('express')
const protected = require('../middleware/auth.middleware')
const messageController=require('../controllers/message.controller')
const router=express.Router()

router.get('/user',protected,messageController.getUsersSidebar)
router.get('/:id',protected,messageController.getMessages)
router.post('/send/:id',protected,messageController.sendMessages)
module.exports=router