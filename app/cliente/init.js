const passport = require('passport');
const User = require('./clienteModel');

function initCliente (app) {
    // URL Profile
    app.get('/perfil', isLoggedIn, renderProfile)

    app.get('/cadastro', function(req, res) {
        res.render('cliente/cadastro', { message: req.flash('signupMessage') })
    })

    // process the signup form
    app.post('/cadastro', passport.authenticate('local-signup', {
        successRedirect : '/perfil', // redirect to the secure profile section
        failureRedirect : '/cadastro', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.post('/cadastrar', function(req, res, next) {
        var email = req.body.email;
        var password = req.body.password;
        var name = req.body.name;

        var resposta = {
            "success": true,
            "message": "Cadastrado com Sucesso",
            "data": {
                // payload here
            }
        };

        User.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error
            if (err)
                return err;

            // check to see if theres already a user with that email
            if (user) {
               resposta.success = false;
               resposta.message = 'o e-mail: "' + email + '" ja está sendo utilizado';

               return res.json(resposta);
            } else {

                // if there is no user with that email
                // create the user
                var newUser = new User();

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);
                newUser.local.name = name;

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return res.json(resposta);
                });
            }

        });
    });

    app.get('/login', function(req, res) {
        // console.log(req.query);
        res.render('cliente/login', { message: req.flash('loginMessage'), Layout: null })
    })

    app.post('/login', function(req, res, next) {

      passport.authenticate('local-login', function(err, user, info){
        // This is the default destination upon successful login.
        var redirectUrl = req.body.returnUrl || '/profile';

        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }

        // If we have previously stored a redirectUrl, use that,
        // otherwise, use the default.
        if (req.session.redirectUrl) {
          redirectUrl = req.session.redirectUrl;
          req.session.redirectUrl = null;
        }
        req.logIn(user, function(err){
          if (err) { return next(err); }
        });
        res.redirect(redirectUrl);
      })(req, res, next);
    });

    app.get('/logout', function(req, res) {
        req.logout();
        req.session.destroy();
        res.redirect('/');
    });
}
ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    // If the user is not authenticated, then we will start the authentication
    // process.  Before we do, let's store this originally requested URL in the
    // session so we know where to return the user later.

    req.session.redirectUrl = req.url;

    // Resume normal authentication...

    logger.info('Usuário não está autenticado.');
    req.flash("warn", "Você deve estar logado para fazer isso.");
    res.redirect('/login');
}

function renderProfile (req, res) {
    res.render('cliente/perfil', {
        usuario: req.user,
        nome: req.user.local.name,
        isLogado: true
    })
}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
      return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}

module.exports = initCliente
