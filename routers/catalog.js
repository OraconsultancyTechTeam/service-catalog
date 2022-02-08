// const express = require('express')
// const connection = require('../db/mySQL')
// const validator = require('validator')
// const router = new express.Router()

const express = require('../app.js').express
const connection = require('../app.js').connection
const validator = require('../app.js').validator
const router = require('../app.js').router
const bcrypt = require('../app.js').bcrypt

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

    function get_preferences(callback) {
        
        // Query to pull preferences
        connection.query(`SELECT * FROM preferences`, (err,response) => {
            if (err) throw (err)

            return callback(response)
        })
    }
    
    get_preferences(function(result) {
        var preferences = result

        if (permission == 1) {
        
            // Query to pull users requests
            connection.query(`SELECT * FROM requests WHERE (teamId='` + req.user.team_id + `')`, (err,response) => {
                if (err) throw (err)
                
                res.render('userprofile', {
                    title: 'Service Catalog',
                    user : req.user,
                    requests : response,
                    preferences
                })
            })
    
        } else {
            res.render('adminprofile', {
                title: 'Service Catalog',
                user : req.user,
                preferences
            })
        }
    })

    
})

router.post('/updateuserdetails', isLoggedIn, (req,res) => {
    email = req.body.email
    userId = req.user.id
    
    if (req.body.newPassword != '') {
        newPass = req.body.newPassword
        confirmPass = req.body.confirmPassword

        var saltRounds = 10

        bcrypt.genSalt(saltRounds, function(err,salt) {
            bcrypt.hash(newPass, salt, function(err,hash) {
                var data = {
                    email,
                    password: hash
                }
                connection.query(`UPDATE users SET ? WHERE id ='` + userId + `'`, data, function(err,result) {
                    if(err) throw err
                })
            })
        })

    } else {
        connection.query(`UPDATE users SET email='`+email+`' WHERE id='` + userId + `'`, (err,response) => {
            if (err) throw (err) 
        })
    }

    res.redirect('/profile')
})

router.get('/users', isLoggedIn, (req,res) => {
    connection.query(`SELECT id, username, first_name, last_name, email, team_id, toggle_account FROM users where permissions=1`, (err,users) => {
        if (err) throw err

        res.render('users', {
            title: 'Users',
            users
        })
    })
})

router.post('/users', isLoggedIn, (req,res) => {
    id = req.body.id
    buttonState = req.body.buttonState
    if (buttonState === true) {
        toggle = 1
    } else {
        toggle = 0
    }
    
    connection.query(`UPDATE users SET toggle_account='`+toggle+`' WHERE id='`+id+`'`, (err,response) => {
        if (err) throw err
    })
})

router.get('/deleteUser/:id', isLoggedIn, (req,res) => {
    connection.query('DELETE FROM users WHERE id=' + req.params.id, (err,response) => {
        if (err) throw err
        else {
            console.log('User deleted successfully')
        }
        return res.redirect('/users')
    })
})

router.get('/editUser/:id', isLoggedIn, (req,res) => {
    connection.query(`SELECT * FROM users WHERE id=` + req.params.id, (err,result) => {
        res.render('edituser', {
            title: 'Edit User Details',
            user: result[0],
            id: req.params.id
        })
    })
})

router.post('/editUser', isLoggedIn, (req,res) => {
    first_name = req.body.firstName
    last_name = req.body.lastName
    email = req.body.email
    team_id = req.body.team_id
    permission = req.body.permission
    id = req.body.id

    connection.query(`UPDATE users SET first_name='` + first_name + `',last_name='` + last_name + `',email='` + email + `',team_id=` + team_id + `,permissions=` + permission + ` WHERE id=` + id, (err,result) => {
        if (err) throw err
        return res.redirect('/users')
    })
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
        permission: req.user.permission
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
            
            if (req.body.option_id != undefined) {
                connection.query(`SELECT option_id, option_heading FROM stage_options WHERE (stage_id=` + stage_id + ` and option_id=` + req.body.option_id + ` and status=1) ORDER BY option_order`, (err,result) => {
                    if (err) throw err
                    step2 = result
                    return res.send(step2)
                })
            } else {
                connection.query(`SELECT option_id, option_heading FROM stage_options WHERE (stage_id=` + stage_id + ` and status=1) ORDER BY option_order`, (err,result) => {
                    if (err) throw err
                    step2 = result
                    return res.send(step2)
                })
            }
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
    
    user = req.user;
    const req_by = user.username;
    const team_id = user.team_id;
  
    // if user chooses custom, set cpu value to 1 
    if (tshirt=='Custom') {
        tshirt = 1
    } else {
        tshirt = tshirt.match(/\d+/g)
    }
    
    connection.query(`select team_manager_email from teams where team_id=`+user.team_id, (error,response) => {
        if (error) throw error
        const manager_email = response[0].team_manager_email

        const sql = "insert into requests values(null,'"+host+"','"+db+"','"+env+"','"+tshirt+"','"+dbsize+"','"+licence+"','"+comment+"','"+due_by+"','"+req_by+"','"+manager_email+"',default,'"+user.id+"','"+team_id+"')";
        connection.query(sql,(err,rows,fields)=>{
            if(err) throw err
            req.flash('catalogMessage', 'Submission has been sent successfully')
            return res.redirect('/catalog')
        })

    })

})

// =====================================
// REQUESTS ============================
// =====================================

router.get('/requests', (req,res) => {
    connection.query('SELECT * FROM requests ORDER BY due_by ASC', (err,result) => {
        res.render('requests', {
            title: 'Service Catalog Requests',
            requests: result
        });
    })
    
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

// We will want this protected so you have to be logged in to visit
// We will use route middleware to verify this (the isLoggedIn function)
router.post('/404Home', isLoggedIn, function(req, res) {
    return res.redirect('/profile')
});

// =====================================
// TEAMS ===============================
// =====================================

router.get('/teams', (req,res) => {
    connection.query('SELECT * FROM teams_view ORDER BY team_id ASC', (err,teams_view) => {
        connection.query('SELECT * FROM teams ORDER BY team_id ASC', (err,teams) => {
            res.render('teams', {
                title: 'Teams',
                teams_view,
                teams
            })
        })
    })
})

router.post('/teams', (req,res) => {
    id = req.body.id
    team_id = req.body.teamSelect

    connection.query(`UPDATE users SET team_id=` + team_id + ` WHERE id=` + id, (err,result) => {
        if (err) throw err
        else {
            console.log('Updated db successfully')
        }
        return res.redirect('/teams')
    })
})

router.get('/addTeam', (req,res) => {
    connection.query(`SELECT * FROM users WHERE toggle_account=1`, (err, result) => {
        res.render('addteam', {
            title: 'Create Team',
            users: result
        })
    })
})

router.post('/addTeam', (req,res) => {
    team_name = req.body.teamName
    manager_email = req.body.mangEmail
    manager_name_lower = req.body.mangName
    manager_name = manager_name_lower.charAt(0).toUpperCase() + manager_name_lower.slice(1)

    connection.query(`INSERT INTO teams (team_name,team_manager,team_manager_email) VALUES ('` + team_name + "','" + manager_name + "','" + manager_email + `')`, (err,result) => {
        if (err) throw err
    })

    team_members = req.body['teamMemberSelect[]']

    team_members.forEach(member => {

    })
})

// =======================================
// MIDDLEWARE ============================
// =======================================

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