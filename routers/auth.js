module.exports = function(app,passport) {

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
  app.get('/forgotpassword', (req,res) => {
    res.render('forgotpassword', {
      title: 'Change Password',
      message: req.flash('changePasswordMessage')
    })
  })

  // Process the forgot password information
  app.post('/forgotpassword', passport.authenticate('local-changepassword',{ successRedirect:'/login', failureRedirect:'/forgotpassword', failureFlash: true }))

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