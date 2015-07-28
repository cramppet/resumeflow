'use strict';

var User = require('../models/user.js');

module.exports.index = function(req, res) {
  res.render('pages/profile/index', { auth: req.isAuthenticated() });
};

module.exports.updateUser = function(req, res) {
  User.findOne({ _id: req.session.uid }, function(err, foundUser) {
    if (err) {
      console.log(err);
      res.json({ message: err.message });
    }

    else {
      if (req.body.password) {
        foundUser.password = foundUser.generateHash(req.body.password);
      }

      foundUser.save(function(err) {
        if (err) {
          console.log(err);
          res.json({ message: err.message });
        }

        else {
          res.json({ message: 'User updated successfully.' });
        }
      });
    }
  });
};
