const Profile = require('../models/Profile.model');
const User = require('../models/User.model');

module.exports.profile = (req, res, next) => {
    const { id } = req.user;

    Profile.findById(id)
    .then(profile => {
        res.render('user/profile')
    })
    .catch(err => next(err))
};

module.exports.createProfile = (req, res, next) => {
    const { id } = req.user;
    const infoToSave = req.body;

    infoToSave.user = id;
    infoToSave.IMC = infoToSave.weight / (infoToSave.height ^ 2);

    if(infoToSave.gender === 'female') {
        infoToSave.GEB = (10 * infoToSave.weight) + (6.25 * infoToSave.height) - (5 * infoToSave.age) - 161;
    } else {
        infoToSave.GEB = (10 * infoToSave.weight) + (6.25 * infoToSave.height) - (5 * infoToSave.age) + 5;
    }

   Profile.findOne({ user: id })
   .then((profile) => {
        if(profile) {
            Profile.findByIdAndUpdate(profile.id, infoToSave)
            .then((updated) => {
                res.redirect('/dashboard')
            })
            .catch(err => next(err))
        } else {
            Profile.create(infoToSave)
            .then((created) => {
                User.findByIdAndUpdate(id, { hasProfileFilled: true })
                .then((done) => {
                    res.redirect('/dashboard')
                })
                .catch(err => next(err))
            })
            .catch(err => next(err))
        }
   })
   .catch(err => next(err))
};