'use strict';

module.exports.logoutUser = function(req, res) {
  req.session.destroy();
  res.redirect('/');
};