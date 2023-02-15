const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema(
{
    breakfast: {
        type: String,
    },
    lunch: {
        type: String,
    },
    dinner: {
        type: String,
    },
    Other: {
        type: String,
    }
}
);

const Diary = mongoose.model('Diary', diarySchema)

module.exports = Diary;