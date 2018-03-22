'use strict';

const express = require('express');
const passport = require('passport');

const ExerciseModel = require('./models');
const WorkoutModel = require('../workouts/models');
const SetModel = require('../sets/models');

const router = express.Router();

const {router: authRouter, localStrategy, jwtStrategy} = require('../auth');

const jwtAuth = passport.authenticate('jwt', { session: false });

// GETS all exercises

router.get('/', jwtAuth, (req, res) => {
  ExerciseModel
    .find()
    .then(exercises => res.json(exercises.map(exercise => exercise.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'})
  );
});

// POSTS or CREATES an exercise with provided name

// router.post('/', jwtAuth, (req, res) => {
//   if (!('name' in req.body)) {
//     const message = `Missing name in request body`
//     console.error(message);
//     return res.status(400).send(message);
//   }
//
//   ExerciseModel
//     .create({
//       workout_id: req.body.workout_id,
//       name: req.body.name
//     })
//     .then(exercise => res.status(201).json(exercise.serialize()))
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({message: 'Internal server error'});
//     });
// });

// PUTS or UPDATES an exercise with a provided exercise Object Id and name

router.patch('/:id', (req, res) => {
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

  WorkoutModel
    .update(
      {_id: req.body.workout_id, "exercises._id": req.params.id },
      {$set: {exercises: {name: req.body.name}}}
    )
    .then(result => res.status(201).json(result))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });

  // ExerciseModel
  //   .findByIdAndUpdate(req.params.id, {$set:{
  //     'name': req.body.name,
  //     }
  //   })
  //   .then(exercise => {
  //     return WorkoutModel.update(
  //       {_id: req.body.workout_id, "exercises._id": req.params.id },
  //       {$set: {exercises: {name: req.body.name}}}
  //     )
  //   })
  //   .then(result => res.status(201).json(result))
  //   .catch(err => res.status(500).json({message: 'Internal server error'}));
});

// DELETES an exercise with a provided exercise Object Id

router.delete('/:id', (req, res) => {
  ExerciseModel
    .findByIdAndRemove(req.params.id)
    .then(exercise => res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

module.exports = {router};
