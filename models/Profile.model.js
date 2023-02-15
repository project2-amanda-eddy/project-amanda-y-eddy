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
    age: {
        type: Number,
        required: [true, 'Age is required']
    },
    activity: {
        type: String,
        required: [true, 'Activity level is required'],
        enum: ["sedentary", "low-active", "active"]
    },
    dietGoal: {
        type: String,
        required: [true, 'Diet goal is required'],
        enum: ["moderate-loss", "fast-loss", "gain"]
    },
    weightGoal: {
        type: Number,
        required: [true, 'Goal Weight is required']
    },
    IMC: {
        type: Number,
    },
    GEB: {
        type: Number,
    },
    GET: {
        type: Number,
    }, 
    timeToLose: {
        type:Number,
    }, 
    timeToGain: {
        type:Number, 
    }
},
{
    timestamps: true,
}
);

const Profile = mongoose.model('Profile', profileSchema)

module.exports = Profile;