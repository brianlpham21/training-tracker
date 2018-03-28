'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const User = require('../users/models');
const ExerciseModel = require('../exercises/models');

const WorkoutSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    date: {type: Date, required: true},
    name: {type: String, required: true},
    exercises: [ExerciseModel.schema]
});

WorkoutSchema.methods.serialize = function() {
  return {
    workout_id: this._id || '',
    user: this.user || '',
    date: this.date || '',
    name: this.name || '',
    exercises: this.exercises || []
  };
};

module.exports = mongoose.model('Workout', WorkoutSchema);
