const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('../user/model')

const authenticationMiddleware = require('./middleware')

passport.serializeUser(function(user, done) {
    //serialize by user id
    done(null, user.id)
});

passport.deserializeUser(function(id, done) {
    //find user in database again
     User.findById(id, function(err, user) {
        done(err, user);
    });
})

function initPassport () {

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        var name = req.body.name;

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'O e-mail "'+ email + '" já está sendo utilizado.'));
                } else {

                    // if there is no user with that email
                    // create the user
                    var newUser            = new User();

                    // set the user's local credentials
                    newUser.local.email    = email;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.local.name = name;

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }

            });
        });

    }));

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    // callback with email and password from our form
    function(req, email, password, done) {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything elses

            if (err) {
                return done(err);
            }

            // if no user is found, return the message
            if (!user) {
                // req.flash is the way to set flashdata using connect-flash
                return done(null, false, req.flash('loginMessage', 'Usuário não encontrado.'));
            }

            // if the user is found but the password is wrong
            if (!user.validPassword(password)) {
                // create the loginMessage and save it to session as flashdata
                return done(null, false, req.flash('loginMessage', 'Oops! Senha errada.'));
            }

            // all is well, return successful user
            return done(null, user);
        });

    }));

    // passport.authenticationMiddleware = authenticationMiddleware
}

module.exports = initPassport
