'use strict';

const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  name: { type: String },
  text: { type: String },
  username: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true},
  created: { type: Date, default: Date.now },
});

noteSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Note', noteSchema);