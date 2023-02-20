const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, 'Body of the comment is required'],
      maxLength: [320, 'Max length must be 320 characters'],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'A comment must have an user']
    },
    image: {
      type: String,
    },
    
  },
  {
    timestamps: true,
  }
)


const Comment = mongoose.model('Community', commentSchema);

module.exports = Comment;