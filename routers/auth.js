//const express = require('express')


//const router = new express.Router()

module.exports = function(app,passport) {
let message
//loads login page
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


// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (!req.isAuthenticated()){
		return next();
    }
    else{
        // if they aren't redirect them to the home page
	    res.redirect('/catalog');
    } 
	
}