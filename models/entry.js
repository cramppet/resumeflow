var mongoose = require('mongoose'),
  db = require('../config/db.js');

function PreviousJob() {
  this.jobTitle = "";
  this.employer = "";
  this.roles = [String];
  this.startDate = null;
  this.endDate = null;
}

var entrySchema = mongoose.Schema({
  first_name:     String,
  middle_name:    String,
  last_name:      String,
  email:          String,
  phone_number:   String,
  address:        String,
  city:           String,
  state:          String,
  degree_type:    String,
  degree_major:   String,
  university:     String,
  keywords:       [String],
  skills:         [String],
  previous_jobs:  [PreviousJob],
  resume_file:    String
});

module.exports = db.entryConnection.model('Entry', entrySchema);
