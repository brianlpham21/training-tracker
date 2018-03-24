'use strict';

const express = require('express');
const passport = require('passport');

const WorkoutModel = require('./models');
const ExerciseModel = require('../exercises/models');
const SetModel = require('../sets/models');

const router = express.Router();

const {router: authRouter, localStrategy, jwtStrategy} = require('../auth');

const jwtAuth = passport.authenticate('jwt', { session: false });

// GETS select workout with provided Object Id

router.get('/:id', jwtAuth, (req, res) => {
  WorkoutModel
    .find()
    .then(workouts => workouts.filter(workout => workout.id === req.params.id))
    .then(workouts => res.json(workouts.map(workout => workout.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'})
  );
});

// PUTS or UPDATES workout with provided workout Object Id and name

router.patch('/:id', jwtAuth, (req, res) => {
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
    .findByIdAndUpdate(req.params.id, {$set:{
      'name': req.body.name,
      }
    })
    .then(workout => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

// DELETES workout with provided workout Object Id

router.delete('/:id', jwtAuth, (req, res) => {
  WorkoutModel
    .findByIdAndRemove(req.params.id)
    .then(workout => res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

// EXERCISE ENDPOINTS

// GETS all exercises from select workout

router.get('/:id/exercises', jwtAuth, (req, res) => {
  WorkoutModel
    .find()
    .then(workouts => workouts.filter(workout => workout.id === req.params.id))
    .then(workout => res.json(workout[0].exercises))
    .catch(err => res.status(500).json({message: 'Internal server error'})
  );
});

// GETS select exercise from select workout

router.get('/:id/exercises/:exercise_id', jwtAuth, (req, res) => {
  WorkoutModel
    .find()
    .then(workouts => workouts.filter(workout => workout.id === req.params.id))
    .then(workout => workout[0].exercises)
    .then(exercises => exercises.filter(exercise => exercise.id === req.params.exercise_id))
    .then(exercise => res.json(exercise))
    .catch(err => res.status(500).json({message: 'Internal server error'})
  );
});

// POSTS or CREATES an exercise within a select workout

router.post('/:id/exercises', jwtAuth, (req, res) => {
  if (!('name' in req.body)) {
    const message = `Missing name in request body`
    console.error(message);
    return res.status(400).send(message);
  }

  WorkoutModel.update(
    {_id: req.params.id},
    {$push: {exercises: {name: req.body.name}}}
  )
  .then(result => res.status(201).json(result))
  .catch(err => {
    console.error(err);
    res.status(500).json({message: 'Internal server error'});
  });
});

// SET ENDPOINTS

// GETS all sets from select exercise

router.get('/:id/exercises/:exercise_id/sets', jwtAuth, (req, res) => {
  WorkoutModel
    .find()
    .then(workouts => workouts.filter(workout => workout.id === req.params.id))
    .then(workout => workout[0].exercises)
    .then(exercises => exercises.filter(exercise => exercise.id === req.params.exercise_id))
    .then(exercise => res.json(exercise[0].sets))
    .catch(err => res.status(500).json({message: 'Internal server error'})
  );
});

// GETS select set from select exercise

router.get('/:id/exercises/:exercise_id/sets/:set_id', jwtAuth, (req, res) => {
  WorkoutModel
    .find()
    .then(workouts => workouts.filter(workout => workout.id === req.params.id))
    .then(workout => workout[0].exercises)
    .then(exercises => exercises.filter(exercise => exercise.id === req.params.exercise_id))
    .then(exercise => exercise[0].sets)
    .then(sets => sets.filter(set => set.id === req.params.set_id))
    .then(set => res.json(set))
    .catch(err => res.status(500).json({message: 'Internal server error'})
  );
});

// POSTS or CREATES a set within a select exercise and workout

router.post('/:workout_id/exercises/:exercise_id/sets', jwtAuth, (req, res) => {
  const requiredFields = ['weight', 'repetitions'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  WorkoutModel
    .update(
      {_id: req.params.workout_id, "exercises._id": req.params.exercise_id },
      {$push: {"exercises.$.sets": {weight: req.body.weight, repetitions: req.body.repetitions}}}
    )
    .then(result => res.status(201).json(result))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

module.exports = {router};

// GETS all workouts

router.get('/', jwtAuth, (req, res) => {
  WorkoutModel
    .find()
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

  WorkoutModel
    .create({
      user: req.user.id,
      date: Date.now(),
      name: req.body.name,
    })
    .then(workout => res.status(201).json(workout.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

router.patch('/:id/exercises/:exercise_id', (req, res) => {
  WorkoutModel.updateOne(
    {_id: req.params.id, 'exercises._id': req.params.exercise_id},
    {$set: {'exercises.$.name':req.body.name}}
  )
  .then(result => res.status(201).json(result))
  .catch(err => {
    console.error(err);
    res.status(500).json({message: 'Internal server error'});
  });
});

router.patch('/:id/exercises/:exercise_id/sets/:sets_id', (req, res) => {
  if (req.body.weight && req.body.repetitions) {
    WorkoutModel.update(
      {_id: req.params.id, 'exercises._id': req.params.exercise_id, 'exercises.sets._id': req.params.sets_id},
      {$set: {'exercises.$.sets.0.weight':req.body.weight}}
    )
    .update(
      {_id: req.params.id, 'exercises._id': req.params.exercise_id, 'exercises.sets._id': req.params.sets_id},
      {$set: {'exercises.$.sets.0.repetitions':req.body.repetitions}}
    )
    .then(result => res.status(201).json(result))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
  }

  else if (req.body.weight) {
    WorkoutModel.updateOne(
      {_id: req.params.id, 'exercises._id': req.params.exercise_id, 'exercises.sets._id': req.params.sets_id},
      {$set: {'exercises.$.sets.0.weight':req.body.weight}}
    )
    .then(result => res.status(201).json(result))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
  }

  else {
    WorkoutModel.updateOne(
      {_id: req.params.id, 'exercises._id': req.params.exercise_id, 'exercises.sets._id': req.params.sets_id},
      {$set: {'exercises.$.sets.0.repetitions':req.body.repetitions}}
    )
    .then(result => res.status(201).json(result))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
  }
});

// DELETES an exercise with a provided exercise Object Id

router.delete('/:id/exercises/:exercise_id', (req, res) => {
  WorkoutModel
    .update(
      {_id: req.params.id},
      {$pull: {'exercises': {'_id': req.params.exercise_id}}}
    )
    .then(result => res.status(201).json(result))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

router.delete('/:id/exercises/:exercise_id/sets/:set_id', (req, res) => {
  WorkoutModel
    .update(
      {_id: req.params.id, "exercises._id": req.params.exercise_id, 'exercises.sets._id': req.params.set_id},
      {$pull: {'sets': {'_id': req.params.set_id}}}
    )
    .then(result => res.status(201).json(result))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

// POSTS or CREATES an exercise within a select workout (Creates Exercise Collection)

// router.post('/:id/exercises', jwtAuth, (req, res) => {
//   if (!('name' in req.body)) {
//     const message = `Missing name in request body`
//     console.error(message);
//     return res.status(400).send(message);
//   }
//
//   ExerciseModel
//     .create({
//       name: req.body.name
//     })
//     .then(exercise => {
//       return WorkoutModel.update(
//         {_id: req.params.id},
//         {$push: {exercises: exercise}}
//       )
//     })
//     .then(result => res.status(201).json(result))
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({message: 'Internal server error'});
//     });
// });

// POSTS or CREATES a set within a select exercise and workout (Creates Set Collection)

// router.post('/:workout_id/exercises/:exercise_id/sets', jwtAuth, (req, res) => {
//   const requiredFields = ['weight', 'repetitions'];
//   for (let i = 0; i < requiredFields.length; i++) {
//     const field = requiredFields[i];
//     if (!(field in req.body)) {
//       const message = `Missing \`${field}\` in request body`
//       console.error(message);
//       return res.status(400).send(message);
//     }
//   }
//
//   SetModel
//     .create({
//       weight: req.body.weight,
//       repetitions: req.body.repetitions
//     })
//     .then(set => {
//       return WorkoutModel.update(
//         {_id: req.params.workout_id, "exercises._id": req.params.exercise_id },
//         {$push: {"exercises.$.sets": set}}
//       )
//     })
//     .then(result => res.status(201).json(result))
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({message: 'Internal server error'});
//     });
// });
