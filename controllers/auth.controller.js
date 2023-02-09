const User = require('../models/User.model');
const mongoose = require('mongoose');
// const passport = require('passport');
const { GENERIC_ERROR_MESSAGE } = require('../config/passport.config');

module.exports.signup = (req, res, next) => {
    res.render('auth/signup')
}

