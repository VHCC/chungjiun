var mongoose = require('mongoose');
var moment = require('moment');

// 收文、發文項目
module.exports = mongoose.model('dnsPlayRoom', {

    // 填文人
    roomOwner: {
        type: String,
        required: true,
    },

    playTime: {
        type: Number,
        required: true
    },

    participants: {
        type: Array
    },

    joinNumber: {
        type: String,
        require: true
    },

    // 1: ready to join
    // 2: playing
    // 3: closed
    // 4: game-over
    roomStatus: {
        type: Number,
        default: 1
    },

    timestamp: {
        type : String,
        default: moment(new Date()).format("YYYYMMDD_HHmmss")
    },






});