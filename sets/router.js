'use strict';

const express = require('express');
const passport = require('passport');

const {Set} = require('./models');

const router = express.Router();

const {router: authRouter, localStrategy, jwtStrategy} = require('../auth');

const jwtAuth = passport.authenticate('jwt', { session: false });

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
