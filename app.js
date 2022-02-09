const path = require('path')
const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const ejs = require('ejs')
const express_layouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const connection = require('./db/mySQL')
var bcrypt = require('bcrypt')
const randtoken = require('rand-token')
const validator = require('validator')
const router = new express.Router()
module.exports.connection = connection
module.exports.bcrypt = bcrypt
module.exports.randtoken = randtoken
module.exports.express = express
module.exports.validator = validator
module.exports.router = router 
const app = express();
const port = process.env.PORT || 3000
const server = require("http").createServer(app);
const io = require("socket.io")(server);


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

// app.use(cookieParser('secret'))
// app.use(session({cookie:{maxAge:null}}))

const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')

require('./middleware/passport')(passport)

//config session
app.use(session({
    secret:process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    cookie:{
        secure: false,
       // maxAge:1000*60*60*24 //86400000 1 day
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Setup handlebars engine and views location
app.set('view engine','ejs')
app.set('views', viewsPath)

app.use(methodOverride('_method'))

// Routers
const catalogRouter = require('./routers/catalog.js')
app.use(catalogRouter)
require('./routers/auth.js')(app,passport); 


// Route To 404 Page
app.use(function(req,res){
    res.status(404).render('404', {
        title: 'Service Catalog'
    })
});


io.on("connection", (socket)=>{
    console.log("new connection: "+socket.id);

    socket.on("disconnect",()=>{
        console.log("disconnected")
    })

    socket.on("requestMade",data =>{
        console.log("Request was made by: "+data);
        io.emit("notification",data)
    })


});

server.listen(port, () => {
    console.log('Server is up on port ' + port)
})

