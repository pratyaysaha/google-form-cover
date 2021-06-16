const express= require('express')
const router=express.Router()
const testModel= require("../models/testDetails")
router.use(express.json())

router.post('/new',async(req,res)=>{
    const newTest= new testModel({
        name : req.body.name,
        link : req.body.link,
        startTime : new Date(req.body.startTime),
        endTime : new Date(req.body.endTime),
        userId : req.body.userId
    })
    try{
        const newTestSave= await newTest.save()
        res.json({status: true, data : newTestSave})
    }
    catch(err){
        res.json({status: false, error: "Database error", additional : err.message, code: 101 })
    }   
})

router.get('/:userid', async(req, res)=>{
    try{
        const testDetails= await testModel.find({'userId': req.params.userid})
        res.json({status: true, data: testDetails })
    }
    catch(err){
        res.json({status: false, error: "Database error", additional : err.msg, code: 101 })
    }
})
router.patch('/examinees/:testid', async(req,res)=>{
    try{
        const updateTest= await testModel.updateOne({'_id': req.params.testid}, {'$set':{'examinees': req.body.examinees}})
        if(updateTest.nModified===0)
        {
            res.json({status : false, error: 'No such tests', code: 102})
        }
        res.json({status: true, data: updateTest})
    }
    catch(err){
        res.json({status: false, error: "Database error", additional : err.msg, code: 101 })
    }
})
router.patch('/:testid', async(req,res)=>{
    try{
        const updateTest= await testModel.updateOne({'_id': req.params.testid},{'name': req.body.name, 'link': req.body.link, 'startTime':  new Date(req.body.startTime), 'endTime': new Date(req.body.endTime)})
        if(updateTest.nModified===0)
        {
            res.json({status : false, error: 'No such tests', code: 102})
        }
        res.json({status: true, data: updateTest})
    }
    catch(err){
        res.json({status: false, error: "Database error", additional : err.msg, code: 101 })
    }

})
router.delete('/:testid',async (req,res)=>{
    try{
        const deleteTest=await testModel.deleteOne({'_id':req.params.testid})
        if(deleteTest.n===0)
        {
            res.json({status : false, error: 'No such tests', code: 102})
        }
        res.json({status : true, data: deleteTest})
    }
    catch(err){
        res.json({status: false, error: "Database error", additional : err.msg, code: 101 })

    }
})
module.exports=router