var mongoose = require('mongoose');

var localDB = 'mongodb://192.168.0.200:32768/workhourexpress';
var remoteDB = 'mongodb://erm.chongjun.myds.me:27017/workhourexpress';

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
