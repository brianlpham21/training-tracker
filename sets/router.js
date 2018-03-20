'use strict';

const express = require('express');
const passport = require('passport');

const {Set} = require('./models');

const router = express.Router();

const {router: authRouter, localStrategy, jwtStrategy} = require('../auth');

const jwtAuth = passport.authenticate('jwt', { session: false });

// GETS all sets

router.get('/', jwtAuth, (req, res) => {
  Set
    .find()
    .then(sets => res.json(sets.map(set => set.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'})
  );
});

// POSTS or CREATES a set for an exercise with provided set, weight, and repetition

router.post('/', jwtAuth, (req, res) => {
  const requiredFields = ['exercise_id', 'set', 'weight', 'repetitions'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Set
    .create({
      exercise_id: req.body.exercise_id,
      set: req.body.set,
      weight: req.body.weight,
      repetitions: req.body.repetitions
    })
    .then(set => res.status(201).json(set.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

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
  const updateableFields = ['set', 'weight', 'repetitions'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    };
  });

  Set
    .findByIdAndUpdate(req.params.id, {$set:{
      'set': toUpdate.set,
      'weight': toUpdate.weight,
      'repetitions': toUpdate.repetitions,
      }
    })
    .then(set => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

// DELETES a set with a provided set Object Id

router.delete('/:id', (req, res) => {
  Set
    .findByIdAndRemove(req.params.id)
    .then(set => res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

module.exports = {router};
