var mongoose = require('mongoose');
var moment = require('moment');

module.exports = mongoose.model('kpiYearBonus', {

    // 年分
    year: {
        type: Number,
    },

    userDID: {
        type: String,
    },

    amount: {
        type: Number,
        default: 0
    },

    memo: {
        type: String,
    },

    type: { // risk, profits,
        type: String,
    },

    timestamp: {
        type: String,
    },






});