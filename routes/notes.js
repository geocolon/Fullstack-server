'use strict';
const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const Note = require('../models/note');
const User = require('../models/user');

// we're going to add some items to ShoppingList
// so there's some data to look at
// ShoppingList.create('beans', 2);
// ShoppingList.create('tomatoes', 3);
// ShoppingList.create('peppers', 4);

// when the root of this router is called with GET, return
// all current ShoppingList items
router.get('/', (req, res, next) => {
  return Note.find()
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});


// when a new shopping list item is posted, make sure it's
// got required fields ('name' and 'checked'). if not,
// log an error and return a 400 status code. if okay,
// add new item to ShoppingList and return it with a 201.
router.post('/', jsonParser, (req, res) => {
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
      return User.findByIdAndUpdate(req.username, {$push: {notes: data._id}})
        .then(() => data);
    })
    .then(item => res.status(201).json(item));
});


// when DELETE request comes in with an id in path,
// try to delete that item from ShoppingList.
router.delete('/:id', (req, res) => {
  Note.delete(req.params.id);
  console.log(`Deleted shopping list item \`${req.params.ID}\``);
  res.status(204).end();
});

// when PUT request comes in with updated item, ensure has
// required fields. also ensure that item id in url path, and
// item id in updated item object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `ShoppingList.update` with updated item.
router.put('/:id', jsonParser, (req, res) => {
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
  console.log(`Updating shopping list item \`${req.params.id}\``);
  const updatedItem = ShoppingList.update({
    id: req.params.id,
    name: req.body.name,
    text: req.body.text
  });
  res.status(204).end();
});
module.exports = router;