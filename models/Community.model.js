const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema(
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

communitySchema.virtual('likes', {
  ref: 'Like',
  foreignField: 'tweet',
  localField: '_id',
  justOne: false
})

const Community = mongoose.model('Community', communitySchema);

module.exports = Community;