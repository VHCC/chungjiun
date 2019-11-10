var mongoose = require('mongoose');
var moment = require('moment');

// 收文、發文項目
module.exports = mongoose.model('dnsPlayRoom', {

    // 填文人
    roomOwner: {
        type: Array,
        required: true,
    },

    playTime: {
        type: Number,
        required: true
    },

    participants: {
        type: Array
    },

    playOrders: {
        type:Array
    },

    difficulty: {
        type: Number
    },

    isAdult: {
        type: Boolean,
        default: false
    },

    joinNumber: {
        type: String,
        require: true
    },

    // 1: setting
    // 2: ready to play
    // 3: playing
    // 4: closed
    // 5: game-over
    roomStatus: {
        type: Number,
        default: 1
    },

    timestamp: {
        type : String,
    },






});