const expressSession = require('express-session');
const MongoStore = require('connect-mongo');
const { MONGO_URL } = require('./db.config');

const MAX_AGE = 7;

module.exports.sessionConfig = expressSession({
  secret: process.env.COOKIE_SECRET || 'super-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.COOKIE_SECURE || false,
    httpOnly: true,
    maxAge: 24 * 3600 * 1000 * MAX_AGE
  },
  store: new MongoStore({
    mongoUrl: MONGO_URL,
    // ttl: 24 * 3600 * MAX_AGE
  })
})