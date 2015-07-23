module.exports.index = function(req, res) {
  res.render('pages/search/index', { auth: req.isAuthenticated() });
};