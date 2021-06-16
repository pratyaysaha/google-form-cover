const express=require('express')
const router= express.Router()
const userRoute= require('./userapiroute')
const testRoute=require('./testapiroute')


router.use('/user',userRoute)
router.use('/test',testRoute)



module.exports=router