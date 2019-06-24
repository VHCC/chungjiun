var database = require('./config/database');           // load the database config
var mongoose = require('mongoose'); 				// mongoose for mongodb
mongoose.connect(database.localUrl);

require('../app/load');