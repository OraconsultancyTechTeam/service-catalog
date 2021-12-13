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
const publicDirectoryPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,'../views')

//setup handlebars engine and views location
app.set('view engine','ejs')

//setup static directory to serve
app.use(express.static(publicDirectoryPath))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(methodOverride('_method'));

app.get('/',(req,res)=>{

    res.render('index',{
        
        title:'User App',
        name:'Dan Bear'
    }
    )
    
})


app.listen(port,()=>{
    console.log('Server is up on port 3000')
})
