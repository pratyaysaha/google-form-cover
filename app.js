const express= require('express')
const mongoose=require('mongoose')
const sessions=require('express-session')
const MongoStore=require('connect-mongo')
const apiRoute= require('./routes/apiroute')
const testModel= require("./models/testDetails")

require('dotenv/config')
const app=express()
app.use(express.static(__dirname+'/css'))
app.use(express.static(__dirname+'/js'))
app.use(express.static(__dirname+'/images'))
app.set('view engine', 'ejs')

const IN_PROD= process.env.NODE_ENV==='production'
const SESSION_EXPIRE= Number(process.env.SESSION_AGE) * 60 * 60* 1000

app.use(sessions({
    name: process.env.SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    secret : process.env.SESSION_SECRET,
    store : MongoStore.create({
        mongoUrl : process.env.DB_CONNECTION,
    }),
    cookie:{
        sameSite : true,
        maxAge : SESSION_EXPIRE,
        secure : IN_PROD,
        httpOnly : false
    }
}))
const redirectToLogin= (req,res,next)=>{
    if(!req.session.islogged)
    {
        res.redirect('/login')
    }
    else
    {
        next()
    }
}
app.use((req,res,next)=>{
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next()
})
app.use('/api', apiRoute)

app.get('/testme',(req,res)=>{
    res.render('test')
})
app.get('/',redirectToLogin, async (req,res)=>{
    if(req.session.userDetails.role === 'Teacher')
    {
        const allTest= await testModel.find({"userId": req.session.userDetails._id})
        console.log(allTest)
        res.render('adminConsole',  {data:req.session.userDetails, tests: allTest} )

    }
    else
    {
        const allTest= await testModel.find({})
        const tests=[]
        allTest.map((item)=>{
            if(item.examinees.includes(req.session.userDetails.email)){
                tests.push(item)
            }
        })
        console.log(tests)
        res.render('studentConsole', {data:req.session.userDetails, tests: tests})
    }
})
app.get('/login',(req, res)=>{
    res.render('login')
})
app.get('/signup',(req,res)=>{
    res.render('signup')
})
app.get('/account',redirectToLogin,(req,res)=>[
    res.render('account',{data:req.session.userDetails} )
])
app.get('/test/:testid',redirectToLogin,async(req,res)=>{
    try{
        const testDetails= await testModel.findById(req.params.testid)
        if(testDetails===null)
        {
            res.render('error',{error: "Test not Found"})
        }
        if(req.session.userDetails.role==='Teacher')
        {
            res.render('gformpage', {data: testDetails, timeLimit: false})
        }
        else
        {
            if(testDetails.examinees.includes(req.session.userDetails.email))
            {
                if (new Date() >= testDetails.startTime && new Date() <= testDetails.endTime) {
                    res.render('gformpage', { data: testDetails, timeLimit: true})
                }
                else {
                    res.send('Test Not Available')
                }
            }
            else
            {
                res.render('error', {error: "Test for not you"})
            }
        }
    }
    catch(err){
        res.render('error',{error: err.message})
    }   
})


mongoose.connect(process.env.DB_CONNECTION,{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
app.listen(process.env.PORT || 3000)