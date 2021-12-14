const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const validator = require('validator')
const ejs = require('ejs')
const methodOverride = require('method-override')
//const connection = require('../db/mySQL')
const app = express()
const port = 3000

//define paths for express config
const publicDirectoryPath = path.join(__dirname,'public')
const viewsPath = path.join(__dirname,'../service-catalog/views')
console.log("Directory Name: "+ viewsPath)

//setup handlebars engine and views location
app.set('view engine','ejs')
app.set('views',viewsPath)

//setup static directory to serve
//app.use(express.static(publicDirectoryPath))
app.use(express.static(__dirname + '/public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(methodOverride('_method'));

app.get('/',(req,res)=>{

    const catalog = [
        {img:'/img/OnPremDatabaseLogo.png', name:'On-Prem Database', text:'The term "on premises" refers to local hardware, meaning data is stored on local servers, computers or other devices.', id:'1'},
        {img:'/img/CloudDatabaseLogo.png', name:'Cloud Database', text:'A cloud database is a database that typically runs on a cloud computing platform and access to the database is provided as-a-service.', id:'2'},
        {img:'/img/GoldenGate.png', name:'Replication - Goldengate', text:'Oracle GoldenGate enables you to replicate data between Oracle databases to other supported heterogeneous database, and between heterogeneous databases.', id:'3'},
        {img:'/img/ApacheNifi.png', name:'Replication - Nifi', text:'Apache NiFi is a software project from the Apache Software Foundation designed to automate the flow of data between software systems. ', id:'4'},
        {img:'/img/ApacheKafka.png', name:'Replication - Kafka', text:'Apache Kafka is a framework implementation of a software bus using stream-processing. It is an open-source software platform developed by the Apache Software Foundation written in Scala and Java.', id:'5'},
      
    ]
    res.render('index',{   
        title:'Service Catalog',
        catalog
    }
    )
    
})


app.listen(port,()=>{
    console.log('Server is up on port 3000')
})
