var mongoose = require('mongoose');
var moment = require('moment');

module.exports = mongoose.model('ProjectFinancialDistribute', {

    // 專案ＤＩＤ
    prjDID: {
        type: String,
    },

    userDID: {
        type: String
    },

    // 11 輸入
    distribute: {
        type: Number,
        default: 0
    },

    memo: {
        type: String,
    },

    timestamp: {
        type: String,
    },

    is011Add: {
        type: Boolean,
        default: false,
    }



});