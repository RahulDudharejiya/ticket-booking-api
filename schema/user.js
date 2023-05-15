/*
FileName : userModel.js
Date : 15th May 2023
Description : This file consist of User's model fields
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true, },
  password: { type: String },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

const index = { firstName: 1, email: 1 };
userSchema.index(index);

module.exports = mongoose.model('Users', userSchema);