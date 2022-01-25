//const express = require('express')


//const router = new express.Router()

module.exports = function(app,passport) {
  
  let message

  // Load login page
  app.get('/login', isLoggedIn, (req, res) => {

    res.render('login', {
        title: 'Service Catalog',
        message: req.flash('loginMessage')
    })
      
  })


  app.post('/login', 
    passport.authenticate('local-login', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/catalog');
  });

  // Process login form
  app.post('/login', passport.authenticate('local-login', {
      successRedirect : '/catalog', // redirect to the secure profile section
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
  });

  // Load register page
  app.get('/register',isLoggedIn, (req, res) => {
    res.render('register', {
        title: 'Service Catalog',
        message: req.flash('registerMessage') 
    })
  })

  app.post('/register',
    passport.authenticate('local-register',{failureRedirect:'/register'}),
    function(req,res){
      res.redirect('/login');
  });

  // =====================================
	// LOGOUT ==============================
	// =====================================
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
    res.redirect('/catalog');
  }
}