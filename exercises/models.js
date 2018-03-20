'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const ExerciseSchema = mongoose.Schema({
    name: {type: String, required: true},
});

ExerciseSchema.methods.serialize = function() {
  return {
    name: this.name || '',
  };
};

const Exercise = mongoose.model('Exercise', ExerciseSchema);

module.exports = {Exercise};
