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
        type: Number
    },
    proteins: {
        type: Number
    },
    fats: {
        type: Number
    },
    carbohydrates: {
        type: Number
    },
    fibers: {
        type: Number
    },
    date: {
        type: String
    }
});

const Diary = mongoose.model('Diary', diarySchema)

module.exports = Diary;