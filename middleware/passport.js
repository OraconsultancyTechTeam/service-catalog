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
        console.log(user)
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
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists

            const firstName = req.body.firstName
            const lastName = req.body.lastName
            const email = req.body.email
            const permission = req.body.permission
            const teamID = req.body.team_id

            if(!validator.isEmail(email)){
                return done(null, false, req.flash('registerMessage', 'Please enter correct email format'))
            }

            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err,rows) {
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
                                    const sql = "INSERT INTO users VALUES(null,'"+username+"','"+hash+"',null,default,null,default,'"+firstName+"','"+lastName+"','"+permission+"','"+email+"',null,'"+teamID+"')";
                                    console.log(sql)
                                    connection.query(sql,(err,users,fields) => {
                                        if(err)
                                          return done(err);
                                        else{
                                            // all is well, return successful user
                                            var newUserMysql = {
                                                username: username,
                                                password: hash,
                                                firstname: firstName,
                                                lastname: lastName,
                                                permission:permission,
                                                email:email
                                                 // use the generateHash function in our user model
                                            };

                                            newUserMysql.id = users.insertId;
                                            return done(null, newUserMysql);
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

    // // =========================================================================
    // // LOCAL changepassword ============================================================
    // // =========================================================================

    // passport.use(
    //     'local-changepassword',
    //     new LocalStrategy({
    //         // by default, local strategy uses username and password, we will override with email
    //         usernameField : 'username',
    //         passwordField : 'newPassword',
    //         passReqToCallback : true // allows us to pass back the entire request to the callback
    //     },
    //     function(req, username, password, done) {
    //         // find a user whose email is the same as the forms email
    //         // we are checking to see if the user trying to login already exists

    //         const firstName = req.body.firstName
    //         const lastName = req.body.lastName
    //         const newPassword = req.body.newPassword
    //         const confirmPassword = req.body.confirmPassword

    //         if (req.body.email) {
    //             const email = req.body.email
    //             if(!validator.isEmail(email)){
    //                 return done(null, false, req.flash('changePasswordMessage', 'Please enter correct email format'));
    //             }
    //         }

    //         if (newPassword != confirmPassword) {
    //             return done(null, false, req.flash('changePasswordMessage', 'Passwords do not match'))
    //         }

    //         connection.query("SELECT * FROM users WHERE username = ?",[username], function(err,rows) {
    //             if (err) return done(err)
    //             if (rows.length) {
    //                 bcrypt.hash(newPassword,saltRounds,(err,hash) => {
    //                     if (err) return done(err);
    //                     else {
    //                         const sql = "UPDATE users SET password='" + hash + "' WHERE username ='" + username + "'";
    //                         connection.query(sql,(err,users) => {
    //                             if(err) throw err
    //                             else{
    //                                 // all is well, return success message
    //                                 return done(null, true, req.flash('changePasswordMessage', 'Password Updated Successfully'))
    //                             }
    //                         })
    //                     }
    //                 })
    //             } else {
    //                 connection.query("SELECT * FROM users WHERE email = ?",[email],function(err,row) {
    //                     if (err) return done(err)
    //                     if (row.length) {
    //                         bcrypt.hash(newPassword,saltRounds,(err,hash) => {
    //                             if (err)
    //                                 return done(err);
    //                             else {
    //                                 const sql = "UPDATE users SET password=" + newPassword + " WHERE email=" + email
    //                                 connection.query(sql,(err,users) => {
    //                                     if (err) throw err
    //                                     else {
    //                                         // all is well, return success message
    //                                         return done(null, true, req.flash('changePasswordMessage', 'Password Updated Successfully'))
    //                                     }
    //                                 })
    //                             }
    //                         })
                    
    //                     }
    //                 })
    //             }
    //         })
    //     })
    // )
}