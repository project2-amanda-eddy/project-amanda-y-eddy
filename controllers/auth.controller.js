const User = require('../models/User.model');
const mongoose = require('mongoose');
const passport = require('passport');
const { GENERIC_ERROR_MESSAGE } = require('../config/passport.config');

//signup controller
module.exports.signup = (req, res, next) => {
    res.render('auth/signup')
};

module.exports.doSignup = (req, res, next) => {
  
    const renderWithErrors = (errors) => {
        res.render('auth/signup', {
            user: {
                email: req.body.email,
            },
            errors
        })
    }

    User.findOne({ email: req.body.email })
        .then(user => {
            if(!user) {
                return User.create(req.body)
                .then(user => {
                    res.redirect('/login')
                })   
            } else {
                renderWithErrors({ email: 'Email already in use'})
            }
        })
        .catch(err => {
            if(err instanceof mongoose.Error.ValidationError) {
                renderWithErrors(err.errors)
            } else {
                next(err)
            }
        })
};

//login controller
module.exports.login = (req, res, next) => {
    res.render('auth/login');
};
  
const doLoginWithStrategy = (req, res, next, strategy = 'local-auth') => {
    const { email, password } = req.body;
    if (strategy === 'local-auth') {
      if (!email || !password) {
        res.status(404).render('auth/login', { errorMessage: GENERIC_ERROR_MESSAGE })
      }
    }


    passport.authenticate(strategy, (err, user, validations) => {
      if (err) {
        next(err)
      } else if (!user) {
        res.status(404).render('auth/login', { user: { email }, errorMessage: validations.error })
      } else {
        req.login(user, (loginError) => {
          if (loginError) {
            next(loginError)
          } else {
            User.findById(user.id)
            .then((user) => {
              if(user.hasProfileFilled) {
                res.redirect('/dashboard');
              } else {
                res.redirect('/profile');
              }
            })
            .catch(err => next(err))
          }
        })
      }
    })(req, res, next)
}
  
module.exports.doLogin = (req, res, next) => {
  doLoginWithStrategy(req, res, next)
};

module.exports.doLoginGoogle = (req, res, next) => {
  doLoginWithStrategy(req, res, next, "google-auth");
};

module.exports.logout = (req, res, next) => {
    req.logout(() => res.redirect("/"));
};
