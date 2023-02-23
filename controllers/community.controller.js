const Comment = require('../models/Community.model');
const mongoose = require('mongoose');
 

module.exports.create = (req, res, next) => {

  Comment.find()
  .populate({
    path: 'user',
    populate: 'profile'
  })
  .populate("likes")
  .sort({createdAt: 'descending'})
  .then(comments => {
    comments.forEach(comment => {
      if (comment.user.id.valueOf() === req.user.id) {
        comment.isMine = true
      }
    })
    res.render('user/community', { comments });
  })
  .catch(err => next(err))
} 

module.exports.doCreate = (req, res, next) => {

  console.log(req.file)

  const newComment = {
    ...req.body,
    user: req.user.id
  }

  if (req.file) {
    newComment.image = req.file.path;
  }

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


  module.exports.comment = (req, res, next) => {
    Comment.find()
    .populate('user')
    .populate('comment')
    .then(comments => {
        res.render('user/community', { comments });
    })
    .catch(err => next(err))
}