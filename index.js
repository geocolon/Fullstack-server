'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');


const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const {localStrategy, jwtStrategy } = require('./passport/local');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
const Users = require('./models/user');
// const {dbConnect} = require('./db-knex');
const app = express();
// Mount routers
app.options('*', cors());
app.use('/api', usersRouter); 
app.use('/api', authRouter);
passport.use(localStrategy);
passport.use(jwtStrategy);


app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);


app.use((req, res, next) => { 
  res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Credentials','true'); 
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization'); res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if(req.method === 'OPTIONS') { return res.sendStatus(204); } return next(); });

app.use(express.static('public'));

app.use(
  express.json()
);

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
