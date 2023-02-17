const Comment = require('../models/Community.model');
const mongoose = require('mongoose');

module.exports.create = (req, res, next) => {
    Comment.find()
        .then(comments => {
            res.render('user/community', { comments });
        })
        .catch(err => next(err))
 
}

module.exports.doCreate = (req, res, next) => {
  const newComment = {
    ...req.body,
    user: req.user.id
  }
  console.log({ newComment });

  Comment.create(newComment)
    .then(comment => {
      res.redirect('/community')
    })
    .catch(err => {
      if (mongoose.Error.ValidationError) {
        res.render('user/community', { comment: req.body.body, errors: err.errors })
      }
      next(err)
    })
}

module.exports.delete = (req, res, next) => {
    Comment.findByIdAndDelete(req.params.id)
      .then(() => {
        res.redirect('/community')
      })
      .catch(err => next(err))
  }