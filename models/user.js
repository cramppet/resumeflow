'use strict';

var mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs'),
  db = require('../config/db.js');

var userSchema = mongoose.Schema({
  email: String,
  password: String,
  admin: Boolean
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.isAdmin = function() {
  return this.admin;
};

module.exports = db.userConnection.model('User', userSchema);
