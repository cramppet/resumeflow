var express       = require('express'),
  app             = express(),
  bodyParser      = require('body-parser'),
  multer          = require('multer'),
  upload          = multer({ dest: 'data/' });
  methodOverride  = require('express-method-override'),
  passport        = require('passport'),
  session         = require('express-session'),
  flash           = require('connect-flash'),
  user            = require('./models/user.js'),
  db              = require('./config/db.js'),
  config          = require('./config/global.js'),
  homePage        = require('./routes/index.js'),
  adminPage       = require('./routes/admin.js'),
  profilePage     = require('./routes/profile.js'),
  signupPage      = require('./routes/signup.js'),
  loginPage       = require('./routes/login.js'),
  entriesPage     = require('./routes/entries.js'),
  searchPage      = require('./routes/search.js'),
  logoutPage      = require('./routes/logout.js');

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}

function isAdmin(req, res, next) {
  user.findOne({ _id: req.session.uid }, function(err, foundUser) {
    if (err)
      res.json({ message: err.message });

    else if (foundUser) {
      if (foundUser.isAdmin())
        return next();
    }

    res.render('pages/home/index', {
      message: 'You are not an administrator.',
      auth: req.isAuthenticated()
    });
  });
}

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('port', (process.env.PORT || 8080));

app.use(express.static(__dirname + '/public'));
app.use(session({ secret: config.secret, resave: true, saveUninitialized: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./config/passport.js')(passport);

app.get('/',                homePage.index);
app.get('/signup',          signupPage.index);
app.get('/login',           loginPage.index);
app.get('/logout',          logoutPage.logoutUser);

app.get('/admin',           isAdmin, adminPage.index);
app.get('/users',           isAdmin, adminPage.getUsers);
app.delete('/user/:id',     isAdmin, adminPage.deleteUser);
app.put('/user/:id',        isAdmin, adminPage.updateUser);

app.get('/profile',         isLoggedIn, profilePage.index);
app.put('/profile',         isLoggedIn, profilePage.updateUser);

app.get('/search',          isLoggedIn, searchPage.index);
app.get('/entries',         isLoggedIn, entriesPage.index);
app.get('/entries/:id',     isLoggedIn, entriesPage.getEntryById);
app.get('/query',           isLoggedIn, entriesPage.getEntriesByQuery);
app.post('/entries',        isLoggedIn, entriesPage.createEntry);
app.delete('/entries/:id',  isLoggedIn, entriesPage.deleteEntry);
app.put('/entries/:id',     isLoggedIn, entriesPage.updateEntry);

app.post('/upload/:id',     isLoggedIn, upload.single('resume'), entriesPage.uploadDocument);
app.get('/download/:id',    isLoggedIn, entriesPage.downloadDocument);

app.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash: true
}));

app.post('/login', passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

app.post('/user', passport.authenticate('local-signup', {
  successRedirect: '/admin',
  failureRedirect: '/admin',
  failureFlash: true
}));

app.listen(app.get('port'), function() {
  console.log('ResumeFlow listening on port ', app.get('port'));
});
