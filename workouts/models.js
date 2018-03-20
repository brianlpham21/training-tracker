'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Exercise = require('../exercises/models');

// import {Exercise} from '../exercises/models';

const WorkoutSchema = mongoose.Schema({
    user_id: {type: String, required: true},
    date: {type: Date, required: true},
    name: {type: String, required: true},
    exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }]
});

WorkoutSchema.methods.serialize = function() {
  return {
    user_id: this.user_id || '',
    date: this.date || '',
    name: this.name || '',
    exercises: this.exercises || ''
  };
};

const Workout = mongoose.model('Workout', WorkoutSchema);

module.exports = {Workout};
