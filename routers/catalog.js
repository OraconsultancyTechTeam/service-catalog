// const express = require('express')
// const connection = require('../db/mySQL')
// const validator = require('validator')
// const router = new express.Router()

const express = require('../app.js').express
const connection = require('../app.js').connection
const validator = require('../app.js').validator
const router = require('../app.js').router

// Initial stages data
let stages
connection.query(`select stage_id, stage_name from stages where status=1 order by stage_order`, (err,res) => {
    if (err) throw err
    return stages = res
})

// Data for Step1
let step1
connection.query(`select * from catalog_services where status=1`, (err,res) => {
    if (err) throw err
    return step1 = res
})

// Route To Home Page
router.get('/', (req, res) => {
    res.render('home', {
        title: 'Service Catalog'
    })
})

// Gets Catalog Page for logged in users
// =====================================
// PROFILE SECTION =====================
// =====================================

router.get('/profile',isLoggedIn, (req, res) => {
    req.flash('message')
    permission = req.user.permissions
    if (permission == 1) {
        
        // Query to pull users requests
        connection.query(`SELECT * FROM requests WHERE (userId='` + req.user.id + `')`, (err,response) => {
            if (err) throw (err) 
            
            res.render('userprofile', {
                title: 'Service Catalog',
                user : req.user,
                requests : response
            })
        })

    } else {
        res.render('adminprofile', {
            title: 'Service Catalog',
            user : req.user
        })
    }
})

// =====================================
// CATALOG =============================
// =====================================

// We will want this protected so you have to be logged in to visit
// We will use route middleware to verify this (the isLoggedIn function)
router.get('/catalog', isLoggedIn, function(req, res) {
    const catalogMessages = req.flash('catalogMessage')
    res.render('index',{
        title: 'Service Catalog',
        step1,
        stages,
        catalogMessages,
        permission
    });
});

// Method checks selected card service id to find corresponding service stages
let service_stages
function stepLooper(stepCard) {
    step1.forEach(element => {
        if (stepCard == element.service_name) {
            connection.query(`select * from service_stages where service_id=`+element.service_id, (err,res) => {
                if (err) throw err
                service_stages = res
            })
           /* service_stages.forEach(stage => {
                
            });*/
        }
    });
}

// method is called when card in catalog is selected
router.post('/catalog', (req,res) => {

    connection.query(`select stage_id from stages where (stage_name='` + req.body.stage_id + `' and status=1)`, (err,response) => {
        if (err) throw (err) 
        else {
            var stage_id = response[0].stage_id
            
            connection.query(`select option_id, option_heading from stage_options where (stage_id=` + stage_id + ` and status=1) order by option_order`, (err,result) => {
                if (err) throw err
                step2 = result
                return res.send(step2)
            })
        }
    })

})

// Method submits data of catalog to database
router.post('/submit', (req,res) => {
    const host = req.body.radio1;
    const db = req.body.radio2;
    const env = req.body.env1;
    let tshirt = req.body.tshirtsize;
    const dbsize = req.body.dbsize;
    const licence = req.body.licensetype;
    const comment = req.body.commentBox;
    const due_by = req.body.dueDate;
   
    const mang_email = req.body.mangEmail;
    

    user = req.user;
    const req_by = user.username;
    const team_id = user.team_id;
   // console.log("This is user id: "+user.id+". This is the name: "+user.username);

    if (!validator.isEmail(mang_email)) {
        req.flash('catalogMessage', 'Please enter the manager email in a correct email format')
        return res.redirect('/catalog')
    } else {
       // if user chooses custom, set cpu value to 1 
        if (tshirt=='Custom') {
            tshirt = 1
        } else {
            tshirt = tshirt.match(/\d+/g)
        }

        const sql = "insert into requests values(null,'"+host+"','"+db+"','"+env+"','"+tshirt+"','"+dbsize+"','"+licence+"','"+comment+"','"+due_by+"','"+req_by+"','"+mang_email+"',default,'"+user.id+"','"+team_id+"')";
        connection.query(sql,(err,rows,fields)=>{
            if(err) throw err
            req.flash('catalogMessage', 'Submission has been sent successfully')
            return res.redirect('/catalog')
        })
    }   
})

// =====================================
// REQUESTS ============================
// =====================================

// let requests

router.get('/requests', (req,res) => {
    connection.query('SELECT * FROM requests ORDER BY due_by ASC', (err,result) => {
        res.render('requests',{
            title: 'Service Catalog Requests',
            requests: result
        });
    })
    
})

router.post('/requests', (req,res) => {

})

router.get('/deleteRequest/:id', (req,res) => {
    connection.query('DELETE FROM requests WHERE id=' + req.params.id, (err,response) => {
        if (err) throw err
        else {
            console.log('Request deleted successfully')
        }
        return res.redirect('/requests')
    })
})

// =====================================
// MIDDLEWARE ============================
// =====================================

// Route middleware to make sure user is authenticated
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated()){
		return next();
    } else {
        // if they aren't redirect them to the home page
	    res.redirect('/');
    }
}

module.exports = router