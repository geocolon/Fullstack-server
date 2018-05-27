'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
  username: { 
    type: String,  
    unique: true,
    required:true
  },
  password: {
    type:String, 
    require: true
  },
  firstname: {type: String, default: ''},
  lastname: {type: String, default: ''}
});

usersSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
};

usersSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

usersSchema.statics.hashPassword = function (password) {
  return bcrypt.compare(password, 10);
};

module.exports = mongoose.model('Users', usersSchema);