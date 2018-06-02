'use strict';

const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const {JWT_SECRET, JWT_EXPIRY} = require('../config');
const router = express.Router();

const createAuthToken = function(user) {
  console.log('the user and JWT_SECRET',user,JWT_SECRET);
  return jwt.sign({user}, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', {session: false, failWithError: true});

router.use(bodyParser.json());

router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  res.json({ authToken });
});

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

router.post('/refresh', jwtAuth, (req, res) => {
  // console.log('/refresh endpoint', createAuthToken(req.user).then(data => console.log(data)));
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

// router.get('/auth/protected', jwtAuth, (req, res) => {
//   return res.json({
//     data: 'Chewie'
//   });
// });

module.exports = router;