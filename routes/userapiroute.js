const express=require('express')
const bcrypt=require('bcrypt')
const router= express.Router()
const userModel= require('../models/user')
router.use(express.json())
router.post('/signup', async (req,res)=>{
    try{
        var hashedPassword= await bcrypt.hash(req.body.password,10)
    }
    catch(err){
        res.json({status : false , error: "Paasword not processed", code : 10})
    }
    const newUser= new userModel({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role
    })
    
    try{
        const userupload= await newUser.save()
        res.json({status: true , data: userupload})
    }
    catch(err)
    {
        res.json({status : false , error: "Database Error", additonal: err.message, code : 11})
    }
})

router.post('/login', async(req, res)=>{
    if(req.body.email===undefined || req.body.password===undefined) 
    {
        res.json({status: false, error : 'email or password not recieved'})
    }
    try{
        const userDetails= await userModel.findOne({'email': req.body.email})
        if(userDetails===null)
        {
            res.json({status: false, error : 'Account not found', code : 101})
        }
        const passCheck= await bcrypt.compare(req.body.password, userDetails.password)
        if(passCheck===true)
        {
            req.session.islogged=true
            req.session.userDetails=userDetails
            console.log(req.session)
            res.json({status: true})
        }
        else
        {
            res.json({status: false, error: "Password not a match", code : 102})
        }
    }
    catch(err){
        res.json({status : false, error: err, code: 100 })
    }
})

router.get('/logout',(req,res)=>{
    delete req.session.userDetails
    req.session.islogged=false
    console.log(req.session)
    res.json({status: true, message: 'logged off'});
})
router.get('/check/:email',async(req,res)=>{
    try{
        const getChecked= await userModel.find({'email': req.params.email})
        if(getChecked.length===0)
        {
            res.json({status: true, message : "Available"})
        }
        res.json({status:false, message : "Not Available", code : 103})
    }
    catch(err)
    {
        res.json({status: false, error: 'Database error', additional: err.message, code : 100})
    }
})
module.exports=router