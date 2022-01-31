const nodemailer = require('nodemailer')

module.exports = function(app,passport) {

  // const connection = require('../db/mySQL.js')
  // var bcrypt = require('bcrypt')
  // const randtoken = require('rand-token')
  const connection = require('../app.js').connection
  var bcrypt = require('../app.js').bcrypt
  const randtoken = require('../app.js').randtoken

  // =====================================
	// LOGIN ===============================
	// =====================================

  // Load login page
  app.get('/login', isLoggedIn, (req, res) => {

    res.render('login', {
        title: 'Service Catalog',
        message: req.flash('loginMessage')
    })
      
  })

  // Process login form
  app.post('/login', passport.authenticate('local-login', {
      successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect : '/login', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
    }),
    function(req, res) {

      if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 3;
      } else {
        req.session.cookie.expires = false;
      }
      res.redirect('/login');
  })

  // =====================================
	// SIGNUP ==============================
	// =====================================

  // Load register page
  app.get('/register',isLoggedIn, (req, res) => {
    res.render('register', {
        title: 'Service Catalog',
        message: req.flash('registerMessage') 
    })
  })

	// Process the signup form
	app.post('/register', passport.authenticate('local-register', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/register', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}))

  // =====================================
	// FORGOT PASSWORD =====================
	// =====================================

  // Load forgot password page
  // app.get('/forgotpassword', (req,res) => {
  //   res.render('forgotpassword', {
  //     title: 'Change Password',
  //     message: req.flash('changePasswordMessage')
  //   })
  // })

  // Process the forgot password information
  // app.post('/forgotpassword', passport.authenticate('local-changepassword',{ successRedirect:'/login', failureRedirect:'/forgotpassword', failureFlash: true }))

  // =====================================
	// RESET PASSWORD ======================
	// =====================================

  /* send reset password link in email */
  app.post('/reset-password-email', function(req, res, next) {
 
    var email = req.body.email

    connection.query('SELECT * FROM users WHERE email ="' + email + '"', function(err,result) {
      if (err) throw err;
      
      var type = ''
      var msg = ''
  
      if (result[0].email.length > 0) {

        var token = randtoken.generate(20);

        var sent = sendEmail(email, token);

          if (sent != '0') {

              var data = {
                  token: token
              }

              connection.query('UPDATE users SET ? WHERE email ="' + email + '"', data, function(err,result) {
                  if(err) throw err
      
              })

              type = 'success';
              msg = 'The reset password link has been sent to your email address'

          } else {
              type = 'error'
              msg = 'Something goes to wrong. Please try again'
          }
      } else {
          // console.log('2')
          type = 'error'
          msg = 'The Email is not registered with us'
      }
      req.flash(type, msg);
      res.redirect('/');
    });
  })

  /* reset page */
  app.get('/reset-password', function(req, res, next) {
    res.render('resetpassword', {
      title: 'Reset Password Page',
      token: req.query.token
    });
  });

  /* update password to database */
  app.post('/update-password', function(req, res, next) {

    var token = req.body.token;
    var password = req.body.password;

    connection.query('SELECT * FROM users WHERE token ="' + token + '"', function(err,result) {
      if (err) throw err;

      var type
      var msg

      if (result.length > 0) {
              
        var saltRounds = 10;

        bcrypt.genSalt(saltRounds, function(err,salt) {
          bcrypt.hash(password, salt, function(err,hash) {
            var data = {
                password: hash
            }
            connection.query('UPDATE users SET ? WHERE email ="' + result[0].email + '"', data, function(err,result) {
                if(err) throw err
            })
          })
        })

        type = 'success'
        msg = 'Your password has been updated successfully'
            
      } else {
        type = 'success'
        msg = 'Invalid link; please try again'
      }
      req.flash(type, msg);
      res.redirect('/login');
    });
  })

  // =====================================
	// LOGOUT ==============================
	// =====================================

  // Log the user out
	app.get('/logout', function(req, res) {
		req.logout()
		res.redirect('/')
	})
}

function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (!req.isAuthenticated()){
		return next();
  } else {
    // if they aren't redirect them to the home page
    res.redirect('/profile');
  }
}

// Send email
function sendEmail(email,token) {
  var email = email
  var token = token

  var mail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'oraconsultancy22@gmail.com',
      pass: 'Test1234!'
    }
  })

  var mailOptions = {
    from: 'oraconsultancy22@gmail.com',
    to: email,
    subject: 'Reset Password Link - Service Catalog',
    html: '<p>You requested for a password reset, kindly use this <a href="http://localhost:3000/reset-password?token=' + token + '">link</a> to reset your password</p>'
  }

  mail.sendMail(mailOptions, function(error,info) {
    if (error) {
      console.log('Error sending email...')
    }
  })
}