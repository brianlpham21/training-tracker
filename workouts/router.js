'use strict';

const express = require('express');
const passport = require('passport');

const {Workout} = require('./models');
const {Exercise} = require('../exercises/models');

const router = express.Router();

const {router: authRouter, localStrategy, jwtStrategy} = require('../auth');

const jwtAuth = passport.authenticate('jwt', { session: false });

// GETS all workouts

router.get('/', jwtAuth, (req, res) => {
  Workout
    .find()
    .then(workouts => res.json(workouts.map(workout => workout.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'})
  );
});

// GETS select workout with provided Object Id

router.get('/:id', jwtAuth, (req, res) => {
  Workout
    .find()
    .then(workouts => workouts.filter(workout => workout.user === req.params.id))
    .then(workouts => res.json(workouts.map(workout => workout.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'})
  );
});

// POSTS or CREATES a new workout with provided name

router.post('/', jwtAuth, (req, res) => {
  if (!('name' in req.body)) {
    const message = `Missing name in request body`
    console.error(message);
    return res.status(400).send(message);
  }

  Workout
    .create({
      user_id: req.user.id,
      date: Date.now(),
      name: req.body.name
    })
    .then(workout => res.status(201).json(workout.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

// PUTS or UPDATES workout with provided workout Object Id and name

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

  Workout
    .findByIdAndUpdate(req.params.id, {$set:{
      'name': req.body.name,
      }
    })
    .then(workout => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

// DELETES workout with provided workout Object Id

router.delete('/:id', (req, res) => {
  Workout
    .findByIdAndRemove(req.params.id)
    .then(workout => res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

module.exports = {router};
