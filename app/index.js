const path = require('path')

const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const passport = require('passport')
const flash = require('connect-flash')
const cookieParser  = require('cookie-parser')
const nunjucks  = require('nunjucks')

const mongoose = require('mongoose');

const MONGODB_HOST = process.env.MONGODB_SERVICE_HOST;
const MONGODB_PORT = process.env.MONGODB_SERVICE_PORT;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE;
const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;

// Build the connection string
const dbURI = 'mongodb://AdminEstampeiroUser:EsTampeiroSenhaDB123@'+MONGODB_HOST+':'+MONGODB_PORT+'/estampeirodb';

// Create the database connection
mongoose.connect(dbURI);

// const config = require('../config')
const app = express()

const session = require('express-session')
const MongoStore = require('connect-mongostore')(session)

app.use(session({
    secret: 'my secret',
    key: 'sid',
    maxAge: new Date(Date.now() + 3600000),
    store: new MongoStore({
      'db':  mongoose.connection.db,
      mongooseConnection: mongoose.connection
    })
}));
// app.use(session({secret: 'secretKey'}))

app.use(cookieParser())
app.use(bodyParser())

app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

require('./authentication').init(app)

nunjucks.configure('./app', {
    watch: true,
    noCache: true,
    express: app
});

app.engine('html', nunjucks.render);

app.set('view engine', 'html');
app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/semantic', express.static(path.join(__dirname, '../semantic')))
app.use('/public', express.static(path.join(__dirname, '../public')))

require('./user').init(app)
require('./workflow').init(app)
require('./home').init(app)
require('./builder').init(app)

module.exports = app
