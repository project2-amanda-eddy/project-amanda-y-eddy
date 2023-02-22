const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    breakfast: {
        type: [],
    },
    lunch: {
        type: [],
    },
    dinner: {
        type: [],
    },
    other: {
        type: [],
    },
    calories: {
        type: Number,
        default: 0
    },
    proteins: {
        type: Number,
        default: 0
    },
    fats: {
        type: Number,
        default: 0
    },
    carbohydrates: {
        type: Number,
        default: 0
    },
    fibers: {
        type: Number,
        default: 0
    },
    date: {
        type: String
    }
});

const Diary = mongoose.model('Diary', diarySchema)

module.exports = Diary;