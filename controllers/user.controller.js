const Profile = require('../models/Profile.model')

module.exports.profile = (req, res, next) => {
    const { id } = req.user;

    Profile.findById({ id })
    .then(profile => {
        if(!profile) {
            res.render('user/profile')
        } else {
            res.redirect('/dashboard')
        }
    })
    .catch(err => next(err))
}