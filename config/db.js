var mongoose = require('mongoose'),
  DB_URL = 'mongodb://localhost';

module.exports.DATABASE_URL = DB_URL;
module.exports.userConnection = mongoose.createConnection(DB_URL + '/users');
module.exports.entryConnection = mongoose.createConnection(DB_URL + '/entries');
