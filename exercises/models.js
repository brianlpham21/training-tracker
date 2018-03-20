'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const ExerciseSchema = mongoose.Schema({
    workout_id: {type: String, required: true},
    name: {type: String, required: true},
    sets: {type: String}
});

ExerciseSchema.methods.serialize = function() {
  return {
    workout_id: this.workout_id || '',
    name: this.name || '',
    sets: this.sets ||''
  };
};

const Exercise = mongoose.model('Exercise', ExerciseSchema);

module.exports = {Exercise};
