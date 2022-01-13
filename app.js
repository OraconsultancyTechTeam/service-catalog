const path = require('path')
const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const ejs = require('ejs')
const express_layouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const connection = require('./db/mySQL')
const app = express()
const port = process.env.PORT || 3000
const userRouter = require('./routers/users')
const catalogRouter = require('./routers/catalog')
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

const cookieParser = require('cookie-parser')
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')

//Alert Messages
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({cookie:{maxAge:null}}))
app.use((req, res, next)=>{
    res.locals.message = req.session.message
    delete req.session.message
    next()
})

/*
//config session
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie:{
        secure: true,
        maxAge:1000*60*60*24 //86400000 1 day
    }
}))

//Enable flash message
app.use(flash());
*/


// Setup handlebars engine and views location
app.set('view engine','ejs')
app.set('views', viewsPath)

app.use(methodOverride('_method'))

//Routers
app.use(userRouter)
app.use(catalogRouter)


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

