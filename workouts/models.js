'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// import ExerciseModel from '../exercises/models';

const ExerciseModel = require('../exercises/models');

const WorkoutSchema = mongoose.Schema({
    user_id: {type: String, required: true},
    date: {type: Date, required: true},
    name: {type: String, required: true},
    exercises: [ExerciseModel.schema]
});

WorkoutSchema.methods.serialize = function() {
  return {
    user_id: this.user_id || '',
    date: this.date || '',
    name: this.name || '',
    exercises: this.exercises || []
  };
};

module.exports = mongoose.model('Workout', WorkoutSchema);
