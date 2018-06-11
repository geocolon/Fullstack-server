'use strict';
const express = require('express');
const router = express.Router();
const passport = require('passport');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const jwtAuth = passport.authenticate('jwt', { session: false });

const Note = require('../models/note');
const User = require('../models/user');

// we're going to add some items to ShoppingList
// so there's some data to look at
// ShoppingList.create('beans', 2);
// ShoppingList.create('tomatoes', 3);
// ShoppingList.create('peppers', 4);

// when the root of this router is called with GET, return
// all current ShoppingList items
router.get('/', (req, res) => {
  Note
    .find()
    .then(notes => {
      res.json(notes);
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message:'Inernal server error'});
      });
});
// Find by ID

router.get('/:id', (req, res, next) => {
  console.log('Values of the req. ',req);
  Note
    .findById(req.params.id)
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Inernal server error'});
    });
});

// when a new shopping list item is posted, make sure it's
// got required fields ('name' and 'checked'). if not,
// log an error and return a 400 status code. if okay,
// add new item to ShoppingList and return it with a 201.
router.post('/', [jwtAuth, jsonParser], (req, res, next) => {
  // ensure `name` and `text` are in request body
  const requiredFields = ['name', 'text'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  return Note.create({name:req.body.name, text:req.body.text})
    .then(data => {
      console.log(req.user.username);
      return User.findOne({username: req.user.username})
        .then((user) => {
          user.notes.push(data.id);
          return user.save();
        });
    })
    .then(item => res.status(201).json(item))
    .catch(err => {
      next(err);
    });
});
  


// when DELETE request comes in with an id in path,
// try to delete that item from Note.
router.delete('/:id', [jwtAuth, jsonParser], (req, res) => {
  Note
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => res.status(500)
      .json(err, {message:'internal server error'}));
});

// when PUT request comes in with updated item, ensure has
// required fields. also ensure that item id in url path, and
// item id in updated item object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `Note.update` with updated item.
router.put('/:id', [jwtAuth, jsonParser], (req, res) => {
  const requiredFields = ['name', 'text', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating note list item \`${req.params.id}\``);
  const updatedItem = ShoppingList.update({
    id: req.params.id,
    name: req.body.name,
    text: req.body.text
  });
  res.status(204).end();
});
module.exports = router;