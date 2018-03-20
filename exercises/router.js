'use strict';

const express = require('express');
const passport = require('passport');

const {Exercise} = require('./models');

const router = express.Router();

const {router: authRouter, localStrategy, jwtStrategy} = require('../auth');

const jwtAuth = passport.authenticate('jwt', { session: false });

router.get('/', jwtAuth, (req, res) => {
  Exercise
    .find()
    .then(exercises => res.json(exercises.map(exercise => exercise.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'})
  );
});

router.put('/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`
    );
    console.error(message);
    return res.status(400).json({message: message});
  };

  if (!('name' in req.body)) {
    const message = `Missing name in request body`
    console.error(message);
    return res.status(400).send(message);
  }

  Exercise
    .findByIdAndUpdate(req.params.id, {$set:{
      'name': req.body.name,
      }
    })
    .then(exercise => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.post('/', jwtAuth, (req, res) => {
  if (!('name' in req.body)) {
    const message = `Missing name in request body`
    console.error(message);
    return res.status(400).send(message);
  }

  Exercise
    .create({
      name: req.body.name
    })
    .then(exercise => res.status(201).json(exercise.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

router.delete('/:id', (req, res) => {
  Exercise
    .findByIdAndRemove(req.params.id)
    .then(exercise => res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

module.exports = {router};
