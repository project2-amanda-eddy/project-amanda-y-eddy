const User = require('../models/User.model');
const mongoose = require('mongoose');
// const passport = require('passport');
const { GENERIC_ERROR_MESSAGE } = require('../config/passport.config');

module.exports.signup = (req, res, next) => {
    res.render('auth/signup')
}

module.exports.doSignup = (req, res, next) => {
    const renderWithErrors = (errors) => {
        res.render('auth/signup', {
            user: {
                email: req.body.email,
                name: req.body.name
            },
            errors
        })
    }

    User.findOne({ email: req.body.email })
        .then(user => {
            if(!user) {
                return User.create(req.body)
                .then(user => {
                    res.redirect('/')
                })   
            } else {
                renderWithErrors({ email: 'Email alreaudy in use'})
            }
        })
        .catch(err => {
            if(err instanceof mongoose.Error.ValidationError) {
                renderWithErrors(err.errors)
            } else {
                next(err)
            }
        })
}

module.exports.doLoginGoogle = (req, res, next) => {
    login(req, res, next, "google-auth");
  };

module.exports.login = (req, res, next) => {
    res.render('auth/login')
}