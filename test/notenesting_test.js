'use strict';
const assert = require('assert');
const mongoose = require('mongoose');
const Note = require('../models/author');

// Describe our test
describe('Nesting records', function(){

  it('Create an authir with sub-documents', function(done){
    let note_test = new note_test({
      name: 'My first note',
      text: 'This is holding dummy text'
    });

    note_test.save().then(function(done){
      Note.findOne({name: 'My first note'});
      done();
    });
  });


});