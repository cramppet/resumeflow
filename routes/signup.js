module.exports.index = function(req, res) {
  res.render('pages/signup/index', { message: req.flash('signupMessage') });
};
