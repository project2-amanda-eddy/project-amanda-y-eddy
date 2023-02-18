const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    breakfast: {
        type: [String],
    },
    lunch: {
        type: [String],
    },
    dinner: {
        type: [String],
    },
    other: {
        type: [String],
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
    carbs: {
        type: Number
    },
    date: {
        type: String
    }
});

const Diary = mongoose.model('Diary', diarySchema)

module.exports = Diary;