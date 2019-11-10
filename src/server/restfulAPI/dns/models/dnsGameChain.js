var mongoose = require('mongoose');
var moment = require('moment');

// 收文、發文項目
module.exports = mongoose.model('dnsGameChain', {

    chainID: {
        type: String
    },

    creator: {
        type: String,
    },

    playerChained: {
        type: Array
    },

    resultsChained: {
        type: Array,
        default: []
    },

    subject: {
        type: String
    },

    parentID: {
        type: String
    },

    timestamp: {
        type : String,
    },






});