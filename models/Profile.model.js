const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    gender: {
        type: String,
        required: [true, 'Gender is required']
    },
    weight: {
        type: Number,
        required: [true, 'Weight is required']
    },
    height: {
        type: Number,
        required: [true, 'Height is required']
    },
    bday: {
        type: Date,
        required: [true, 'Date of Birth is required']
    },
    activity: {
        type: String,
        required: [true, 'Activity level is required'],
        enum: ["sedentary", "low-active", "active", "very-active"]
    },
    dietGoal: {
        type: String,
        required: [true, 'Diet goal is required']
    },
    goalWeight: {
        type: Number,
        required: [true, 'Goal Weight is required']
    
    },
},
{
    timestamps: true,
}
);

const Profile = mongoose.model('Profile', profileSchema)

module.exports = Profile;