const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'A like must have a user']
    },
    comment: {
      type: mongoose.Types.ObjectId,
      ref: 'Comment',
      required: [true, 'A like must have a comment']
    }
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true
    }
  }
)

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;