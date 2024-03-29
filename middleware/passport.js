// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;


// load up the user model
var bcrypt = require('bcrypt')
const validator = require('validator')
var connection = require('../db/mySQL')
const saltRounds = 10;

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user,done) {
        // console.log(user)
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        
        connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err,user){
            done(err, user[0]);
        });
        
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for register
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, users){
                if (err)
                    return done(err);
                if (!users.length) {
                    return done(null, false,req.flash('loginMessage', 'No user found.') ); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, users[0].password))
                    return done(null, false,req.flash('loginMessage', 'Oops! Wrong password.') ); // create the loginMessage and save it to session as flashdata

                if (users[0].toggle_account == 0) {
                    return done(null, false,req.flash('loginMessage', 'Permission, Please Let Admin Know to Activate Your Account') ); // req.flash is the way to set flashdata using connect-flash
                }
    

                 
                // all is well, return successful user
                return done(null, users[0]);
            });
            
        })
    );

    // =========================================================================
    // LOCAL register ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for register
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-register',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'firstName',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req,username,password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists

            const firstName = req.body.firstName
            const lastName = req.body.lastName
            const email = req.body.email
            const permission = req.body.permission
            const teamID = req.body.team_id

            var fname = firstName.substring(0,1).toLowerCase();
            var lname = lastName.toLowerCase();
            var randomNum =  Math.floor(Math.random() * 1000);
            var user_name = lname + fname+ randomNum;


            var password = Math.random().toString(36).slice(2);
            


            if(!validator.isEmail(email)){
                return done(null, false, req.flash('registerMessage', 'Please enter correct email format'))
            }

            connection.query("SELECT * FROM users WHERE username = ?",[user_name], function(err,rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('registerMessage', 'That username is already taken.'));
                } else {
                    connection.query("SELECT * FROM users WHERE email = ?",[email],function(err,row) {
                        if (err)
                            return done(err);
                        if (row.length) {
                            return done(null,false,req.flash('registerMessage','That email is already taken'));
                        }
                        else{

                            bcrypt.hash(password,saltRounds,(err,hash) => {
                                if (err)
                                    return done(err);
                                else {
                                    const sql = "INSERT INTO users VALUES(null,'"+user_name+"','"+hash+"',null,default,null,'"+firstName+"','"+lastName+"','"+permission+"','"+email+"',null,'"+teamID+"',default)";
                                    // console.log(sql)
                                    connection.query(sql,(err,users,fields) => {
                                        if(err)
                                          return done(err);
                                        else{
                                            // all is well, return successful user
                                            var newUserMysql = {
                                                username: user_name,
                                                password: password, 
                                                email:email,
                                                firstName:firstName,
                                                lastName:lastName                                               
                                            };
                                         
                                           
                                            user =req.user
                                            regMessage = ('User Created')
                                            return done(null, user,{regMessage,newUserMysql});
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        })
    )

  
}