var mongoose = require('mongoose');
var moment = require('moment');

// 收文、發文項目
module.exports = mongoose.model('dnsGameChain', {

    roomID: {
        type: String
    },

    playerChained: {
        type: Array
    },

    resultsChained: {
        type: Array
    },

    subJect: {
        type: String
    },

    parentID: {
        type: String
    },

    timestamp: {
        type : String,
        default: moment(new Date()).format("YYYYMMDD_HHmmss")
    },






});