const passport = require('passport');
const server = require('../config');
const FacebookTokenStrategy = require('passport-facebook-token');

passport.use('facebook-token', new FacebookTokenStrategy({
	clientID: server.FACEBOOK_ID,
	clientSecret: server.FACEBOOK_SECRET,
}, (accessToken, refreshToken, profile, done) => {
	var user = {
		'email': profile.emails[0]?.value || '',
		'firstName' : profile.name.givenName,
		'lastName' : profile.name.familyName,
		'id'   : profile.id,
		'token': accessToken
	}
	return done(null, user)
}))

passport.serializeUser(function(user, done) {
	done(null, user);
});

const facebookValidate = (req, res, next) => { 
	passport.authenticate('facebook-token', (err, data) => {
		if(err){
			res.status(400).json({
				success: false,
				error: 'Token validation error'
			});
			return;
		}else{
			next();
		}
	})(req,res,next)
}

module.exports = facebookValidate;