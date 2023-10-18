var mongoose = require('mongoose');

var isDev = true;
var dbName = 'com001'

var localDB = 'mongodb://root:F0973138343f@localhost:31115/' + dbName + "?authSource=admin";

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