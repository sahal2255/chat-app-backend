const express =require('express')
const userController =require('../controllers/auth.controller.js')
const router=express.Router()
const protected =require('../middleware/auth.middleware.js')

router.post('/signup',userController.signup)
router.post('/login' ,userController.login);
router.post('/logout',userController.logout )

router.put('/update-profile' , protected ,userController.updateProfile)
router.get('/check',protected,userController.checkAuth)
module.exports =router