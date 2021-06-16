const mongoose=require('mongoose')
const validator=require('validator')
const user = mongoose.Schema({
    name :{
        type : String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required:true,
        validate:{
                validator : (value) =>{
                    return validator.isEmail(value)
                },
                message : "Provide a valid email"
            }
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true,
    }
})  
module.exports=mongoose.model('User',user)