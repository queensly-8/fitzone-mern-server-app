const mongoose = require('mongoose');

const workoutRoutine = new mongoose.Schema({
    userId:{
        type: String,
        required: [true, 'UserID is required']
    },
    exerciseName:{
        type: String,
        required:[true, 'Please input your exercise routine']
    },
    duration:{
        type: String,
        required:[true, 'Input your time of exercise']
    },
    status:{
        type: String,
        default: 'pending'
    },
    dateAdded:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Workouts', workoutRoutine);