'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const SetModel = require('../sets/models');

const ExerciseSchema = mongoose.Schema({
  name: {type: String, required: true},
  sets: [SetModel.schema]
});

ExerciseSchema.methods.serialize = function() {
  return {
    name: this.name || '',
    sets: this.sets || []
  };
};

module.exports = mongoose.model('Exercise', ExerciseSchema);
