var Entry = require('../models/entry.js'),
  fs = require('fs'),
  path = require('path'),
  busboy = require('connect-busboy'),
  config = require('../config/global.js');

function transformCSV(csv) {
  if (csv)
    return csv.split(',');
  return null;
}

module.exports.index = function(req, res) {
  res.render('pages/entries/index', { auth: req.isAuthenticated() });
};

module.exports.createEntry = function(req, res) {
  /* TODO: Perform input validation on user-submitted data */

  Entry.findOne({ email: req.body.email }, function(err, entry) {
    if (err)
      res.json({ message: err.message });

    else if (entry)
      res.json({ message: 'A user already exists with that email.' });

    else {
      var newEntry = new Entry();

      newEntry.first_name     = req.body.first_name;
      newEntry.middle_name    = req.body.middle_name;
      newEntry.last_name      = req.body.last_name;
      newEntry.email          = req.body.email;
      newEntry.phone_number   = req.body.phone_number;
      newEntry.address        = req.body.address;
      newEntry.city           = req.body.city;
      newEntry.state          = req.body.state;
      newEntry.degree_type    = req.body.degree_type;
      newEntry.degree_major   = req.body.degree_major;
      newEntry.university     = req.body.university;
      newEntry.skills         = transformCSV(req.body.skills);
      newEntry.keywords       = transformCSV(req.body.keywords);
      newEntry.previous_jobs  = transformCSV(req.body.previous_jobs);

      newEntry.save(function(err) {
        if (err)
          res.json({ message: err.message });

        else {
          res.json({ message: 'Entry successfully created.', id: newEntry._id });
        }
      });
    }
  });
};

module.exports.deleteEntry = function(req, res) {
  Entry.findOneAndRemove({ _id: req.params.id }, function(err) {
    if (err)
      res.json({ message: err.message });

    else
      res.json({ message: 'Entry successfully deleted.' });
  });
};

module.exports.updateEntry = function(req, res) {
  /* TODO: Perform input validation on user-submitted data */

  Entry.findOne({ _id: req.params.id }, function(err, entry) {
    if (err)
      res.json({ message: err.message });

    else {
      entry.first_name    = (req.body.first_name ? req.body.first_name : entry.first_name);
      entry.middle_name   = (req.body.middle_name ? req.body.first_name : entry.middle_name);
      entry.last_name     = (req.body.last_name ? req.body.first_name : entry.last_name);
      entry.email         = (req.body.email ? req.body.first_name : entry.email);
      entry.phone_number  = (req.body.phone_number ? req.body.first_name : entry.phone_number);
      entry.address       = (req.body.address ? req.body.first_name : entry.address);
      entry.city          = (req.body.city ? req.body.first_name : entry.city);
      entry.state         = (req.body.state ? req.body.first_name : entry.state);
      entry.degree_type   = (req.body.degree_type ? req.body.first_name : entry.degree_type);
      entry.degree_major  = (req.body.degree_major ? req.body.first_name : entry.degree_major);
      entry.university    = (req.body.university ? req.body.first_name : entry.university);
      entry.skills        = transformCSV(req.body.skills ? req.body.skills : entry.skills);
      entry.keywords      = transformCSV(req.body.keywords ? req.body.keywords : entry.keywords);
      entry.previous_jobs = transformCSV(req.body.previous_jobs ? req.body.previous_jobs : entry.previous_jobs);

      entry.save(function(err) {
        if (err)
          res.json({ message: err.message });

        else
          res.json({ message: 'Entry successfully updated.' });
      });
    }
  });
};

module.exports.getEntriesByQuery = function(req, res) {
  /* TODO: Properly parse 'previous jobs' parameters */
  /* TODO: Perform input validation on user-submitted data */

  if (req.query.keywords) {
    var keywords = transformCSV(req.query.keywords);
    req.query.keywords = { $in: keywords };
  }

  else if (req.query.keywords === '') {
    delete req.query.keywords;
  }

  if (req.query.skills) {
    var skills = transformCSV(req.query.skills);
    req.query.skills = { $in: skills };
  }

  else if (req.query.skills === '') {
    delete req.query.skills;
  }

  if (req.query.first_name === '') {
    delete req.query.first_name;
  }

  if (req.query.last_name === '') {
    delete req.query.last_name;
  }

  if (req.query.degree_type === '') {
    delete req.query.degree_type;
  }

  Entry.find(req.query, function(err, entry) {
    if (err)
      res.json({ message: err.message });

    else
      res.json(entry);
  });
};

module.exports.getEntryById = function(req, res) {
  Entry.findOne({ _id: req.params.id }, function(err, entry) {
    if (err)
      res.json({ message: err.message });

    else if (!entry)
      res.json({ message: 'No entry with the id provided can be found.' });

    else
      res.json(entry);
  });
};

module.exports.uploadDocument = function(req, res) {
  if (!req.file) {
    res.json({ message: 'File could not be uploaded.' });
  }

  else {
    var newFilename = req.file.filename + path.extname(req.file.originalname);

    fs.rename(
        config.fileUploadPath + req.file.filename,
        config.fileUploadPath + newFilename,
      function() {
        Entry.findOne({ _id: req.params.id }, function(err, foundEntry) {
          if (err)
            res.json({ message: err.message });

          else if (!foundEntry)
            res.json({ message: 'Could not find entry to upload to' });

          else {
            foundEntry.resume_file = config.fileUploadPath + newFilename;
            foundEntry.save(function(err) {
              if (err)
                res.json({ message: err.message });
              else
                res.json({ message: 'Entry successfully created. '});
            });
          }
        });
      });
  }
};

module.exports.downloadDocument = function(req, res) {
  Entry.findOne({ _id: req.params.id }, function(err, foundEntry) {
    if (err)
      res.json({ message: err.message });

    else {
      if (!foundEntry.resume_file)
        res.json({ message: 'No resume has been uploaded for that entry.' });

      else {
        res.download(foundEntry.resume_file);
      }
    }
  });
};
