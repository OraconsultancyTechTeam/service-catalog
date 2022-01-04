const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const validator = require('validator')
const ejs = require('ejs')
const express_layouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const connection = require(__dirname,'/db/mySQL')
const app = express()
const port = process.env.PORT || 3000

var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Define paths for express config
const publicDirectoryPath = path.join(__dirname,'public')
const viewsPath = path.join(__dirname, 'views')
//console.log("Directory Name: "+ viewsPath)

// Setup static directory to serve
//app.use(express.static(publicDirectoryPath))
app.use(express.static('public'))
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Setup handlebars engine and views location
app.set('view engine','ejs')
app.set('views', viewsPath)

app.use(methodOverride('_method'))

const step1 = [
    {img:'/img/OnPremDatabaseLogo.png', name:'On-Prem Database', text:'The term "on premises" refers to local hardware, meaning data is stored on local servers, computers or other devices.', id:'1', g:'1'},
    {img:'/img/CloudDatabaseLogo.png', name:'Cloud Database', text:'A cloud database is a database that typically runs on a cloud computing platform and access to the database is provided as-a-service.', id:'2', g:'1'},
    {img:'/img/GoldenGate.png', name:'Replication - Goldengate', text:'Oracle GoldenGate enables you to replicate data between Oracle databases to other supported heterogeneous database, and between heterogeneous databases.', id:'3', g:'1'},
    {img:'/img/ApacheNifi.png', name:'Replication - Nifi', text:'Apache NiFi is a software project from the Apache Software Foundation designed to automate the flow of data between software systems. ', id:'4', g:'1'},
    {img:'/img/ApacheKafka.png', name:'Replication - Kafka', text:'Apache Kafka is a framework implementation of a software bus using stream-processing.', id:'5', g:'1'},
]

const step2 = [
    {img:'/img/oracledatabase.png', name:'Oracle Database', text:'Oracle Database is a multi-model database management system produced and marketed by Oracle Corporation', id:'6', g:'2'},
    {img:'/img/sql-server.png', name:'SQL Server', text:'Microsoft SQL Server is a relational database management system developed by Microsoft.', id:'7', g:'2'},
    {img:'/img/mysqllogo.png', name:'My SQL', text:'MySQL is an open-source relational database management system.', id:'8', g:'2'},
    {img:'/img/apachecassandra.png', name:'Apache Cassandra', text:'Cassandra is a free and open-source, distributed, wide-column store, NoSQL database management system designed to handle large amounts of data across many commodity servers, providing high availability with no single point of failure.', id:'9', g:'2'},
    {img:'/img/redislogo.png', name:'Redis', text:'Redis is an in-memory data structure store, used as a distributed, in-memory key–value database, cache and message broker, with optional durability. ', id:'10', g:'2'},
]

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

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Service Catalog',
        step1,
        step2,
        step3,
        step4,
        step6
    })
})

app.post('/submit', urlencodedParser ,(req,res) => {

    console.log(req.body)
    // const step_1 = req.body.step1
    // const step_2 = req.body.step2
    // const step_3 = req.body.step3
    // const step_4 = req.body.step4
    // const step_5 = req.body.step5
    // const step_6 = req.body.step6
    // const step_7 = req.body.step7
    // const step_8 = req.body.step8

    // const sql = "insert into requests values(null,'"+step_1+"','"+step_2+"','"+step_3+"','"+step_4+"','"+step_5+"','"+step_6+"','"+step_7+"','"+step_8+"',default,null)";
    // connection.query(sql,(err,rows,fields)=>{
    //     if (err) throw err
    //     res.render('index',{
    //         title: 'Service Catalog',
    //         step1,
    //         step2,
    //         step3,
    //         step4,
    //         step6
    //     })
   
    // })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})