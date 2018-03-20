'use strict';
const express = require('express');
const passport = require('passport');

const {Exercise} = require('./models');

const router = express.Router();

const {router: authRouter, localStrategy, jwtStrategy} = require('../auth');

const jwtAuth = passport.authenticate('jwt', { session: false });

router.get('/', jwtAuth, (req, res) => {
  // return res.send(req.user.id);
  return Exercise.find()
    .then(exercises => res.json(exercises.map(exercise => exercise.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'})
  );
});

router.post('/', jwtAuth, (req, res) => {
  return Exercise.create({
    name: "Bench Press"
  });
});

module.exports = {router};
