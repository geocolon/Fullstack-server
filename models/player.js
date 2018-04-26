'use strict';

const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type:String, unique:true },
  score:{
    update: {type: Date, default:Date.now},
    totalScore: { type: Number, default:0 }
  }
});

playerSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Players', playerSchema);