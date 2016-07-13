const passport = require('passport')

function initHome(app) {
  app.get('/builder', function(req, res) {

    let isLogado = req.user ? true : false;

    res.render('builder/index', {
        isLogado,
        notLayoutMenu: true,
        invertedMenu: true,
        noFooter: true
    })
  })
}

module.exports = initHome
