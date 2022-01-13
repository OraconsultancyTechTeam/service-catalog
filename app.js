const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const validator = require('validator')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const ejs = require('ejs')
const express_layouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const connection = require('./db/mySQL')
const app = express()
const port = process.env.PORT || 3000
const axios = require('axios')

var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Define paths for express config
const publicDirectoryPath = path.join(__dirname,'public')
const viewsPath = path.join(__dirname, 'views')

// Setup static directory to serve
//app.use(express.static(publicDirectoryPath))
app.use(express.static('public'))
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(cookieParser('secret'))
app.use(session({cookie:{maxAge:null}}))

// Setup handlebars engine and views location
app.set('view engine','ejs')
app.set('views', viewsPath)

app.use(methodOverride('_method'))

// Stages data
let stages
connection.query(`select stage_id, stage_name from stages where status=1 order by stage_order`, (err,res) => {
    if (err) throw err
    //console.log(res)
    return stages = res
})

// Data for Step1
let step1
connection.query(`select * from catalog_services where status=1`, (err,res) => {
    if (err) throw err
    return step1 = res
})

// Data for Step2
// var service_id = 1
// //console.log(req.body.radio1)
// connection.query(`select * from step2 where service_id=`+service_id+``, (err,res) => {
//     if (err) throw err
//     return step2 = res
// })

// const step1 = [
//     {img:'/img/OnPremDatabaseLogo.png', name:'On-Prem Database', text:'The term "on premises" refers to local hardware, meaning data is stored on local servers, computers or other devices.', id:'1', g:'1'},
//     {img:'/img/CloudDatabaseLogo.png', name:'Cloud Database', text:'A cloud database is a database that typically runs on a cloud computing platform and access to the database is provided as-a-service.', id:'2', g:'1'},
//     {img:'/img/GoldenGate.png', name:'Replication - Goldengate', text:'Oracle GoldenGate enables you to replicate data between Oracle databases to other supported heterogeneous database, and between heterogeneous databases.', id:'3', g:'1'},
//     {img:'/img/ApacheNifi.png', name:'Replication - Nifi', text:'Apache NiFi is a software project from the Apache Software Foundation designed to automate the flow of data between software systems. ', id:'4', g:'1'},
//     {img:'/img/ApacheKafka.png', name:'Replication - Kafka', text:'Apache Kafka is a framework implementation of a software bus using stream-processing.', id:'5', g:'1'},
// ]

// const step2 = [
//     {img:'/img/oracledatabase.png', name:'Oracle Database', text:'Oracle Database is a multi-model database management system produced and marketed by Oracle Corporation', id:'6', g:'2'},
//     {img:'/img/sql-server.png', name:'SQL Server', text:'Microsoft SQL Server is a relational database management system developed by Microsoft.', id:'7', g:'2'},
//     {img:'/img/mysqllogo.png', name:'My SQL', text:'MySQL is an open-source relational database management system.', id:'8', g:'2'},
//     {img:'/img/apachecassandra.png', name:'Apache Cassandra', text:'Cassandra is a free and open-source, distributed, wide-column store, NoSQL database management system designed to handle large amounts of data across many commodity servers, providing high availability with no single point of failure.', id:'9', g:'2'},
//     {img:'/img/redislogo.png', name:'Redis', text:'Redis is an in-memory data structure store, used as a distributed, in-memory key–value database, cache and message broker, with optional durability. ', id:'10', g:'2'},
// ]

const step3 = [
    {name:'PRD', id:1}, 
    {name:'TRG', id:2},
    {name:'UAT', id:3}, 
    {name:'DVP', id:4}
]

const step4 = [
    {size:'2 CPU',id:1},
    {size:'4 CPU',id:2},
    {size:'6 CPU',id:3},
    {size:'8 CPU',id:4},
    {size:'10 CPU',id:5},
    {size:'12 CPU',id:6},
    {size:'24 CPU',id:7},
    {size:'30 CPU',id:8},
    {size:'Custom - Please provide comment',id:9}
]

const step6 = [
    {name:'Enterprise Edition',id:1},
    {name:'Advanced Security',id:2},
    {name:'Advanced Compression',id:3}
]

app.use((req, res, next)=>{
    res.locals.message = req.session.message
    delete req.session.message
    next()
})


app.get('/', (req, res) => {
    res.render('home', {
        title: 'Service Catalog'
    })
})

app.get('/login', (req, res) => {
    res.render('login', {
        title: 'Service Catalog'
    })
})

app.post('/login', (req, res) => {
    const userName = req.body.userName
    const password = req.body.password
    connection.query('SELECT * FROM users where username = ?',userName,(error,result)=>{
        if (error) throw error

        if (result.length>0){

            bcrypt.compare(password, result[0].password,(err,response) => {
                if (response) {
                    res.redirect('/catalog')
                    return;
                } else {
                    req.session.message = {
                        type:'danger',
                        intro:'Invalid Login',
                        message:'Login Details Incorrect'
                    }
                    res.redirect('/login')
                    return;
                }
            })

        } else {
            req.session.message = {
                type:'danger',
                intro:'Invalid Login',
                message:'User does not exist'
            }
            res.redirect('/login')
            return;
        }
    })
})

app.post('/logout', (req, res) => {
    const userName = req.body.userName
    const password = req.body.password
    // Needs completing
})

app.get('/register', (req, res) => {
    res.render('register', {
        title: 'Service Catalog'
    })
})

app.post('/register',(req,res)=>{

    const userName = req.body.userName
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email
    const password = req.body.password
    const permission = req.body.permission
    const currentDate = Date.now()
    const salt = "veryImportantString"
    
    if(!validator.isEmail(email)){
        req.session.message = {
            type:'warning',
            intro:'Invalid Email',
            message:'Please Enter a Valid Email'
        }
        res.redirect('/register')
        return;
    }

    connection.query('SELECT email FROM users WHERE email = ?',[email],(error,result)=>{
        if(error) throw error

        if(result.length>0){
            req.session.message = {
                type:'warning',
                intro:'Invalid Email',
                message:'Email is already in use'
            }
            res.redirect('/register')
            return;
        }
    })

    // Hashing password
    bcrypt.hash(password,saltRounds,(err,hash)=>{
        const sql = "insert into users values(null,'"+userName+"','"+hash+"',null,default,null,default,'"+firstName+"','"+lastName+"','"+permission+"','"+email+"')";
        connection.query(sql,(err,rows,fields)=>{
            if(err) throw err
            req.session.message = {
                type:'success',
                intro:'Data Saved',
                message:'Account has been successfully created'
            }
            res.redirect('/')
       
        })
    })
})

app.get('/catalog', (req, res) => {
    res.render('index', {
        title: 'Service Catalog',
        stages,
        step1,
        step2,
        step3,
        step4,
        step6
    })
})

let service_stages
let step2
app.post('/catalog', (req,res) => {
    stepLooper(req.body.stepCard)
    res.render('index', {
        title: 'Service Catalog',
        stages,
        service_stages,
        step1,
        step2,
        step3,
        step4,
        step6
    })
})

function stepLooper(stepCard) {
    step1.forEach(element => {
        if (stepCard == element.service_name) {
            connection.query(`select stage_id, stage_name from service_stages where (service_id=` + element.service_id + ` and status=1) order by stage_order ASC`, (err,res) => {
                if (err) throw err
                return service_stages = res
            })
        }
    });
}

app.post('/submit',(req,res) => {
    const host = req.body.radio1;
    const db = req.body.radio2;
    const env = req.body.env1;
    const tshirt = req.body.tshirtsize;
    const dbsize = req.body.dbsize;
    const licence = req.body.licensetype;
    const comment = req.body.commentBox;
    //const due_by = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const due_by = req.body.dueDate;
    const req_by = req.body.reqBy;
    const mang_email = req.body.mangEmail;
    
    if(!validator.isEmail(mang_email)){

        req.session.message = {
            type:'danger',
            intro:'Wrong Format',
            message:'Please enter the manager email in an email format'
        }
        
        res.redirect('/catalog')
    return;
    }


    const sql = "insert into requests values(null,'"+host+"','"+db+"','"+env+"','"+tshirt+"','"+dbsize+"','"+licence+"','"+comment+"','"+due_by+"','"+req_by+"','"+mang_email+"',default)";
    connection.query(sql,(err,rows,fields)=>{
        if(err) throw err

        req.session.message = {
            type:'success',
            intro:'Data Saved',
            message:'Submission has been successfully sent'
        }
        res.redirect('/catalog')

/*
        res.render('index',{
            title: 'Service Catalog',
            msg1:'Submission Successful, Data Saved',
            step1,
            step2,
            step3,
            step4,
            step6
    })
   */
    // })
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
