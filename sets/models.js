'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const SetSchema = mongoose.Schema({
  weight: {type: Number, required: true},
  repetitions: {type: Number, required: true}
});

// SetSchema.methods.serialize = function() {
//   return {
//     weight: this.weight || '',
//     repetitions: this.repetitions || '',
//   };
// };

module.exports = mongoose.model('Set', SetSchema);
