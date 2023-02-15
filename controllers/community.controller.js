const Community = require('../models/Community.model');
const mongoose = require('mongoose');

module.exports.create = (req, res, next) => {
  res.render('user/community');
}

module.exports.doCreate = (req, res, next) => {
  const newCommunity = {
    ...req.body,
    user: req.user.id
  }
  console.log({ newCommunity });

  Community.create(newCommunity)
    .then(community => {
      res.redirect('/community')
    })
    .catch(err => {
      if (mongoose.Error.ValidationError) {
        res.render('user/community', { community: req.body.body, errors: err.errors })
      }
      next(err)
    })
}

