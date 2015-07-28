'use strict';

var User = require('../models/user.js');

module.exports.index = function(req, res) {
  res.render('pages/admin/index', { auth: req.isAuthenticated() });
};

module.exports.getUsers = function(req, res) {
  User.find(function(err, foundUser) {
    if (err) {
      console.log(err);
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
      console.log(err);
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
      console.log(err);
      res.json({ message: err.message });
    }
    
    else {
      foundUser.email       = req.body.email;
      foundUser.admin       = req.body.admin;
      var newPassword       = (req.body.password ? req.body.password : foundUser.password);

      if (req.body.password === newPassword) {
        newPassword         = foundUser.generateHash(newPassword);
      }

      foundUser.password    = newPassword;

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

module.exports.createUser = function(req, res) {
  User.findOne({ email: req.body.email }, function(err, foundUser) {
    if (err) {
      console.log(err);
      res.json({ message: err.message });
    }

    else if (foundUser) {
      res.json({ message: 'User account already exists.'});
    }

    else {
      var newUser      = new User();
      newUser.email    = req.body.email;
      newUser.password = newUser.generateHash(req.body.password);
      newUser.admin    = req.body.admin;

      newUser.save(function(err) {
        if (err) {
          console.log(err);
          res.json({ message: err.message }); 
        }

        else {
          res.json({ message: 'User successfully created.' });
        }
      });
    }
  });
};
