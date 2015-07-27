'use strict';

var User = require('../models/user.js');

module.exports.index = function(req, res) {
  res.render('pages/admin/index', { auth: req.isAuthenticated() });
};

module.exports.getUsers = function(req, res) {
  User.find(function(err, foundUser) {
    if (err) {
      res.json({ message: err.message });
    }

    else {
      res.json(foundUser);
    }
  });
};

module.exports.deleteUser = function(req, res) {
  User.findOneAndRemove({ _id: req.params.id }, function(err) {
    if (err) {
      res.json({ message: err.message });
    }

    else {
      res.json({ message: 'User successfully deleted.' });
    }
  });
};

module.exports.updateUser = function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, foundUser) {
    if (err) {
      res.json({ message: err.message });
    }

    else {
      var newEmail = (req.body.email ? req.body.email : foundUser.email);
      var newPassword = foundUser.password;

      if (req.body.password)
        newPassword = foundUser.generateHash(req.body.password);

      foundUser.email = newEmail;
      foundUser.password = newPassword;

      foundUser.save(function(err) {
        if (err)
          res.json({ message: err.message });

        else
          res.json({ message: 'User updated successfully.' });
      });
    }
  });
};
