const passport = require('passport')

function initWorkflow (app) {
    app.get('/workflow', isLoggedInWorkflow, renderWorkflow)
}

function renderWorkflow (req, res) {
    var isLogado = req.user ? true : false;

    res.render('workflow/index', {
        isLogado: isLogado
    });
}

function isLoggedInWorkflow(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
      return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/login?returnUrl=/workflow');
}

module.exports = initWorkflow
