var mongoose = require('mongoose');

var isDev = true;
var dbName = 'com001'

var localDB = 'mongodb://localhost:27017/' + dbName;

module.exports = {
    localUrl: localDB
};

var db = mongoose.connection;

db.on('error', function callback() {
    console.error.bind(console, 'connection error:');
});

db.once('open', function callback() {
    if(isDev) {
        console.log("----- Database Connected to " + localDB.toString() + " -----");
    }
});