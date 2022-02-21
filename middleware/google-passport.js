const { connection } = require('../app');

var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

module.exports = function(passport) {
    // used to serialize the user for the session
    passport.serializeUser(function(user,done) {
        // console.log(user)
        done(null, user.id);
    });

    // used to deserialize the user
 /*   passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err,user){
            done(err, user[0]);
        });   
    });
*/
    passport.deserializeUser((req, user, done) => {

        connection.query("SELECT * FROM users WHERE id = ?  OR google_id", [user.id, 
          user.facebook_id, user.google_id], (err, rows) => {
            if (err) {
                console.log(err);
                return done(null, err);
            }
                done(null, user);
        });
    });

  //google login
  passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback"||"https://ora-service-catalog.herokuapp.com/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    const email = profile.emails[0].value;
    //console.log(email)
    connection.query("SELECT * FROM users WHERE email = ?",[email], function(err, users){
        if (err)
            return done(err);
        if (!users.length) {
            return done(null, false,request.flash('loginMessage', 'No user found.') ); // req.flash is the way to set flashdata using connect-flash
        }

        if (users[0].toggle_account == 0) {
            return done(null, false,request.flash('loginMessage', 'Permission, Please Let Admin Know to Activate Your Account') ); // req.flash is the way to set flashdata using connect-flash
        }

        // all is well, return successful user
        return done(null, users[0]);
    });

    //  return done(null, profile);
  }
));
}