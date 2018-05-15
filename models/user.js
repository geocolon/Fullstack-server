'use strict';

const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
  username: { type:String,  unique: true },
  password: String,
  
});

usersSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Users', usersSchema);