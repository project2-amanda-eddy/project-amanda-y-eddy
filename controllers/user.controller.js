const Profile = require('../models/Profile.model');
const User = require('../models/User.model');
const Comment = require('../models/Community.model');
const Like = require('../models/Like.model');

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
    infoToSave.IMC = infoToSave.weight / (infoToSave.height * infoToSave.height) * 10000;

    if(infoToSave.gender === 'female') {
        infoToSave.GEB = (10 * infoToSave.weight) + (6.25 * infoToSave.height) - (5 * infoToSave.age) - 161;
        if (infoToSave.activity === 'sedentary') {
            infoToSave.GET = (infoToSave.GEB * 1.2); 
        } else if (infoToSave.activity === 'low-active') {
            infoToSave.GET = (infoToSave.GEB * 1.56);
        } else {
            infoToSave.GET = (infoToSave.GEB * 1.64);
        }
    } else {
        infoToSave.GEB = (10 * infoToSave.weight) + (6.25 * infoToSave.height) - (5 * infoToSave.age) + 5;
        if (infoToSave.activity === 'sedentary') {
            infoToSave.GET = (infoToSave.GEB * 1.2); 
        } else if (infoToSave.activity === 'low-active') {
            infoToSave.GET = (infoToSave.GEB * 1.55);
        } else {
            infoToSave.GET = (infoToSave.GEB * 1.78);
        }
    }

    if(infoToSave.dietGoal === 'moderate-loss') {
        infoToSave.timeToLose = (infoToSave.weight - infoToSave.weightGoal) * 30 / 2;
    } else if (infoToSave.dietGoal === 'fast-loss') {
         infoToSave.timeToLose = (infoToSave.weight - infoToSave.weightGoal) * 30 / 4;
    } else {
         infoToSave.timeToLose = (infoToSave.weight - infoToSave.weightGoal) * 30 / 4;
    }

    if(infoToSave.dietGoal === 'moderate-loss' || 'fast-loss') {
        infoToSave.recommendedCarbohydrate = (infoToSave.GET * 0.3 / 4);
        infoToSave.recommendedProtein = (infoToSave.GET * 0.4 / 4);
        infoToSave.recommendedFat = (infoToSave.GET * 0.3 / 4);
    } else if (infoToSave.dietGoal === 'gain') {
        infoToSave.recommendedCarbohydrate = (infoToSave.GET * 0.4 / 4);
        infoToSave.recommendedProtein = (infoToSave.GET * 0.4 / 4);
        infoToSave.recommendedFat = (infoToSave.GET * 0.2 / 4);
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

module.exports.doEditProfilePicture = (req, res, next) => {

    User.findByIdAndUpdate(req.user.id, { image: req.file?.path, username: req.body?.username })
        .then(() => res.redirect('/profile'))
        .catch(next)
}

//analytics
module.exports.showAnalytics = (req, res, next) => {
    const userId = req.user.id;
    
    Profile.findOne({ user: userId })
    .then((profile) => {
        res.render('user/analytics', { profile })
    })
    .catch(err => next(err))
}

//coments
module.exports.comment = (req, res, next) => {
    Comment.find()
    .populate('user')
    .populate('comment')
    .populate('likes')
    .then(comments => {
        console.log("holaaaaaa")
        res.render('user/community', { comments });
    })
    .catch(err => next(err))
}

module.exports.like = (req, res, next) => {
    const user = req.user.id;
    const comment = req.params.id;
  
    const like = {
      user,
      comment
    };

    Like.findOne({ user, comment })
    .then(dbLike => {
      if (dbLike) {
        return Like.findByIdAndDelete(dbLike.id)
          .then((createdLike) => {
            res.status(204).json({ deleted: true })
          })
      } else {
        return Like.create(like)
          .then(() => {
            res.status(201).json({ deleted: false })
          })
      }
    })
    .catch(err => next(err))
}