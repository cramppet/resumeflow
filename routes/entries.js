'use strict';

var Entry   = require('../models/entry.js'),
  fs        = require('fs'),
  path      = require('path'),
  config    = require('../config/global.js');

function transformCSV(csv) {
  if (csv && csv.indexOf(',') !== -1)
    return csv.split(',');
  else if (csv && csv.indexOf(',') === -1)
    return [csv];
  else
    return null;
}

module.exports.index = function(req, res) {
  res.render('pages/entries/index', { auth: req.isAuthenticated() });
};

module.exports.createEntry = function(req, res) {
  /* TODO: Perform input validation on user-submitted data */

  Entry.findOne({ email: req.body.email }, function(err, entry) {
    if (err) {
      console.log(err);
      res.json({ message: err.message });
    }

    else if (entry)
      res.json({ message: 'A user already exists with that email.' });

    else {
      var newEntry = new Entry();

      newEntry.first_name     = (req.body.first_name    ? req.body.first_name   : 'N/A');
      newEntry.middle_name    = (req.body.middle_name   ? req.body.middle_name  : 'N/A');
      newEntry.last_name      = (req.body.last_name     ? req.body.last_name    : 'N/A');
      newEntry.email          = (req.body.email         ? req.body.email        : 'N/A');
      newEntry.phone_number   = (req.body.phone_number  ? req.body.phone_number : 'N/A');
      newEntry.address        = (req.body.address       ? req.body.address      : 'N/A');
      newEntry.city           = (req.body.city          ? req.body.city         : 'N/A');
      newEntry.state          = (req.body.state         ? req.body.state        : 'N/A');
      newEntry.degrees        = req.body.degrees;
      newEntry.skills         = transformCSV(req.body.skills);
      newEntry.keywords       = transformCSV(req.body.keywords);
      newEntry.previous_jobs  = transformCSV(req.body.previous_jobs);

      newEntry.save(function(err) {
        if (err) {
          console.log(err);
          res.json({ message: err.message });
        }

        else {
          res.json({ message: 'Entry successfully created.', id: newEntry._id });
        }
      });
    }
  });
};

module.exports.deleteEntry = function(req, res) {
  Entry.findOneAndRemove({ _id: req.params.id }, function(err) {
    if (err) {
      console.log(err);
      res.json({ message: err.message });
    }

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
      entry.first_name    = req.body.first_name;
      entry.middle_name   = req.body.middle_name;
      entry.last_name     = req.body.last_name;
      entry.email         = req.body.email;
      entry.phone_number  = req.body.phone_number;
      entry.address       = req.body.address;
      entry.city          = req.body.city;
      entry.state         = req.body.state;
      entry.degrees       = req.body.degrees;
      entry.skills        = transformCSV(req.body.skills);
      entry.keywords      = transformCSV(req.body.keywords);
      entry.previous_jobs = transformCSV(req.body.previous_jobs);

      entry.save(function(err) {
        if (err) {
          console.log(err);
          res.json({ message: err.message });
        }

        else {
          res.json({ message: 'Entry successfully updated.' });
        }
      });
    }
  });
};

module.exports.getEntriesByQuery = function(req, res) {
  /* TODO: Perform input validation on user-submitted data */

  var first_name   = (req.query.first_name   ? req.query.first_name   : null);
  var last_name    = (req.query.last_name    ? req.query.last_name    : null);
  var degree_type  = (req.query.degree_type  ? req.query.degree_type  : null);
  var degree_major = (req.query.degree_major ? req.query.degree_major : null);
  var skills       = (req.query.skills       ? req.query.skills       : null);
  var keywords     = (req.query.keywords     ? req.query.keywords     : null);
  var final_query  = {};

  // Skills and Keywords query parsing

  if (skills && keywords) {
    final_query['$or'] = [
      { skills:   { $in: transformCSV(skills)   }},
      { keywords: { $in: transformCSV(keywords) }}
    ];
  }

  else if (skills) {
    final_query['skills']   = { $in: transformCSV(skills) };
  }

  else if (keywords) {
    final_query['keywords'] = { $in: transformCSV(keywords) };
  }

  // Degree type and major query parsing

  if (degree_type && degree_major) {
    final_query['$and'] = [
      { 'degrees.degree_type' : { $in: transformCSV(degree_type) } },
      { 'degrees.degree_major': { $in: transformCSV(degree_major) } } 
    ];
  }

  else if (degree_type) {
    final_query['degrees.degree_type'] = { $in: transformCSV(degree_type) };
  }

  else if (degree_major) {
    final_query['degrees.degree_major'] = { $in: transformCSV(degree_major) };
  }

  // Build up the first and last name query objects

  if (first_name && last_name) {
    final_query['first_name'] = first_name;
    final_query['last_name']  = last_name;
  }

  else if (first_name) {
    final_query['first_name'] = first_name;
  }

  else if (last_name) {
    final_query['last_name']  = last_name;
  }

  Entry.find(final_query, function(err, entry) {
    if (err) {
      console.log(err);
      res.json({ message: err.message });
    }

    else
      res.json(entry);
  });
};

module.exports.getEntryById = function(req, res) {
  Entry.findOne({ _id: req.params.id }, function(err, entry) {
    if (err) {
      console.log(err);
      res.json({ message: err.message });
    }

    else if (!entry) {
      res.json({ message: 'No entry with the id provided can be found.' });
    }

    else {
      res.json(entry);
    }
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
          if (err) {
            console.log(err);
            res.json({ message: err.message });
          }

          else if (!foundEntry)
            res.json({ message: 'Could not find entry to upload to' });

          else {
            foundEntry.resume_file = config.fileUploadPath + newFilename;
            foundEntry.save(function(err) {
              if (err) {
                console.log(err);
                res.json({ message: err.message });
              }
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
    if (err) {
      console.log(err);
      res.json({ message: err.message });
    }

    else {
      if (!foundEntry.resume_file) {
        res.json({ message: 'No resume has been uploaded for that entry.' });
      }

      else {
        res.download(foundEntry.resume_file);
      }
    }
  });
};
