module.exports.index = function(req, res) {
  res.render('pages/login/index', { message: req.flash('loginMessage'), auth: false });
};
