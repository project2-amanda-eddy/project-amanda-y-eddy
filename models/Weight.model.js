const mongoose = require('mongoose');

const weightSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    },
    weight: {
      type: Number,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    IMC: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: false,
    toObject: {
      virtuals: true
    }
  }
)

const Weight = mongoose.model('Weight', weightSchema);

module.exports = Weight;