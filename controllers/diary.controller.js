const Diary = require('../models/Diary.model');
const axios = require('axios')

//DIARY CONTROLLER
module.exports.dashboard = (req, res, next) => {
    res.render('user/dashboard')
}

// module.exports.createDiary = (req, res, next) => {

// }

