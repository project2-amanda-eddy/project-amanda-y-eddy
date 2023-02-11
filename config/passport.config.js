const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require('../models/User.model');

passport.serializeUser((user, next) => {
  next(null, user.id)
})

passport.deserializeUser((id, next) => {
  User.findById(id)
    .then(user => {
      next(null, user)
    })
    .catch(err => next(err))
})

const GENERIC_ERROR_MESSAGE = 'Email or password are incorrect'

passport.use('local-auth', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  (email, password, next) => {
    // Comprobar si ya existe el usuario
    User.findOne({ email })
      .then(user => {
        if (!user) {
          next(null, false, { error: GENERIC_ERROR_MESSAGE })
        } else {
          // Comprobar la contraseña
          return user.checkPassword(password)
            .then(match => {
              if (!match) {
                next(null, false, { error: GENERIC_ERROR_MESSAGE })
              } else {
                next(null, user)
              }
            })
        }
      })
      .catch(err => next(err))
  }
));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleID: profile.id })
        .then(user => {
          if (user) {
            done(null, user);
            return;
          }
          User.create({ googleID: profile.id })
            .then(newUser => {
              done(null, newUser);
            })
            .catch(err => done(err)); // closes User.create()
        })
        .catch(err => done(err)); // closes User.findOne()
    }
  )
);

module.exports.GENERIC_ERROR_MESSAGE = GENERIC_ERROR_MESSAGE;