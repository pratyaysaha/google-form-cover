const mongoose=require('mongoose')
const testDetails = mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    name:{
        type : String,
        required : true
    },
    link:{
        type: String,
        requred: true
    },
    startTime:{
        type: Date,
        required: true,
    },
    endTime:{
        type: Date,
        required: true
    },
    examinees:{
        type: [String]
    }
})
module.exports=mongoose.model('testDetails',testDetails)