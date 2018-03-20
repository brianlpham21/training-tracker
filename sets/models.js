'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const SetSchema = mongoose.Schema({
    exercise_id: {type: String, required: true},
    set: {type: Number, required: true},
    weight: {type: Number, required: true},
    repetitions: {type: Number, required: true}
});

SetSchema.methods.serialize = function() {
  return {
    set: this.set || '',
    weight: this.weight || '',
    repetitions: this.repetitions || '',
  };
};

const Set = mongoose.model('Set', SetSchema);

module.exports = {Set};
