require('dotenv').config();


const express = require('express');
const logger = require('morgan');
const createError = require('http-errors');
const passport = require('passport');

//DB connection
require('./config/db.config');

//HBS configuration
require('./config/hbs.config');

//Passport configuration
require('./config/passport.config')

const app = express();

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));

//views 
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

//Configure static files */
app.use(express.static('public'));

//configure session middlewares
const { sessionConfig } = require('./config/session.config');
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(req.user);
  res.locals.currentUser = req.user;
  next()
});

//configure routes
const router = require('./config/routes.config');
app.use('/', router)

//configure errors middlewares
app.use((req, res, next) => {
    next(createError(404, 'Resource not found'));
});
  
app.use((error, req, res, next) => {
    console.log(error)
    let status = error.status || 500;
  
    res.status(status).render('error', {
      message: error.message,
      error: req.app.get('env') === 'development' ? error : {}
    })
})
  
const PORT = process.env.PORT || 3000
  
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));