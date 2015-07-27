'use strict';

module.exports.index = function(req, res) {
  res.render('pages/home/index', { auth: req.isAuthenticated() });
};
