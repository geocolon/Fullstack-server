'use strict';

const mongoose = require('mongoose');

const { DATABASE_URL } = require('../config');
const Users = require('../models/user');

const seedUsers = require('../db/seed/users');

mongoose.connect( DATABASE_URL )
  .then(() => mongoose.connection.db.dropDatabase())
  .then(()=> {
    return Promise.all([
      Users.insertMany(seedUsers)
    ]);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });