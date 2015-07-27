var mongoose = require('mongoose'),
  db = require('../config/db.js');

// TODO: Figure out why we are not allowed to use the pre-defined objects
// that we have created in order to work with the user-submitted data.

// See: Degree and degrees field of entrySchema

function PreviousJob() {
  this.jobTitle  = "";
  this.employer  = "";
  this.roles     = [String];
  this.startDate = null;
  this.endDate   = null;
}

function Degree() {
  this.degree_type  = "";
  this.degree_major = "";
  this.university   = "";
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
  degrees:        [],
  keywords:       [String],
  skills:         [String],
  previous_jobs:  [],
  resume_file:    String
});

module.exports = db.entryConnection.model('Entry', entrySchema);
