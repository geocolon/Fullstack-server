'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
const Users = require('./models/user');
// const {dbConnect} = require('./db-knex');

const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.use(express.static('public'));

app.use(
  express.json()
);

const testArray = [
  'Bath Blue',
  'Barkham Blue',
  'Buxton Blue',
  'Cheshire Blue',
  'Devon Blue',
  'Dorset Blue Vinney',
  'Dovedale',
  'Exmoor Blue',
  'Harbourne Blue',
  'Lanark Blue',
  'Lymeswold',
  'Oxford Blue',
  'Shropshire Blue',
  'Stichelton',
  'Stilton',
  'Blue Wensleydale',
  'Yorkshire Blue'
];

const userTest = {
  id:'00001',
  name: 'George',
  score: {
    update: new Date(2018,3,26),
    totalScore: 1000000000
  }
};
 
/* ============ GET/FIND SCORE ============= */

app.get('/api/users', (req, res, next) => {
  return Users.find()
    .then(data => {
      return res.json(data);
    })
    .catch(err =>{
      next(err);
    });
   
  
});


/* ============ POST/CREATE USERS AND SCORE ============= */

app.post('/api/users', (req, res, next)=> {

  Users.create(req.body)
    .then(result => {
      console.log(result);
      return res.status(201).json(result);      
    })
    .catch(err => {
      next(err);
    });
});

/* ============ PUT/UPDATE USERS AND SCORE ============= */
app.put('/api/users/:id', (req, res, next) => {
  const id = req.params.id;
  Users.findByIdAndUpdate(id, {score:{totalScore: req.body.score}} )
    .then((obj) => {
      res.status(201).json(obj);
    })
    .catch(err => {
      next(err);
    });
});

/* ============ DELETE/REMOVE USERS AND SCORE ============= */
app.delete('/api/users/:id', (req,res, next) => {
  
  const id = req.params.id;
  
  Users.findByIdAndRemove( id )
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
});




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
