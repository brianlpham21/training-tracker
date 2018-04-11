'use strict';

const express = require('express');
const passport = require('passport');

const SetModel = require('./models');

const router = express.Router();

const {router: authRouter, localStrategy, jwtStrategy} = require('../auth');

const jwtAuth = passport.authenticate('jwt', { session: false });

// PUTS or UPDATES a set for an exercise with provided set Object Id, set, weight, and repetition

router.put('/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`
    );
    console.error(message);
    return res.status(400).json({message: message});
  };

  const toUpdate = {};
  const updateableFields = ['weight', 'repetitions'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    };
  });

  SetModel
    .findByIdAndUpdate(req.params.id, {$set:{
      'weight': toUpdate.weight,
      'repetitions': toUpdate.repetitions,
      }
    })
    .then(set => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {router};
