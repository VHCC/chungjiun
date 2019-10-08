var mongoose = require('mongoose');
var moment = require('moment');

module.exports = mongoose.model('Temp', {

    tempID: {
      type: String,
    },

    creatorDID: {
        type: String,
    },

    timestamp: {
        type : String,
        default: moment(new Date()).format("YYYYMMDD_HHmmss")
    },




});