var mongoose = require('mongoose');
var moment = require('moment');

module.exports = mongoose.model('ProjectKPIElements', {

    // 年分
    year: {
        type: Number,
    },

    memo: {
        type: String,
    },

    amount: {
        type: Number,
        default: 0
    },

    amount2: {
        type: Number,
        default: 0
    },

    type: { // risk, profits, person, executive
        type: String,
    },

    timestamp: {
        type: String,
    },

    userDID: {
        type: String,
    },


});