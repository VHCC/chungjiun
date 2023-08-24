var mongoose = require('mongoose');

var localDB = 'mongodb://localhost:27017/hongsystem';
var remoteDB = 'mongodb://ichenprocin.dsmynas.com:27017/hongsystem';
// var localDB = 'mongodb://localhost:27017/workhourexpress';
// var remoteDB = 'mongodb://ichenprocin.dsmynas.com:27017/workhourexpress';


module.exports = {
    remoteUrl: remoteDB,
    localUrl: localDB
};

var db = mongoose.connection;

db.on('error', function callback() {
    console.error.bind(console, 'connection error:');
});

db.once('open', function callback() {
    console.log("----- Database Connected to " + localDB.toString() + " -----");
});