var mongoose = require('mongoose');

var localDB = 'mongodb://192.168.1.151:27017/dnsgame';
var remoteDB = 'mongodb://ichenprocin.dsmynas.com:27017/dnsgame';

module.exports = {
    remoteUrl: remoteDB,
    localUrl: localDB
};

var db = mongoose.connection;

db.on('error', function callback() {
    console.error.bind(console, 'connection error:');
});

db.once('open', function callback() {
    console.log("----- Database Connected to " + remoteDB.toString() + " -----");
});