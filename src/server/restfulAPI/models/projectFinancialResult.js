var mongoose = require('mongoose');
var moment = require('moment');

module.exports = mongoose.model('ProjectFinancialResult', {

    // 年分
    year: {
        type: Number,
    },

    // 專案ＤＩＤ
    prjDID: {
        type: String,
    },

    income: {
        type: Number,
        default: 0
    },

    otherCost: {
        type: Number,
        default: 0
    },

    // 費率
    // 技師費
    rate_item_1: {type: Number, default: 0},
    // 行政
    rate_item_2: {type: Number, default: 0},
    // 利潤
    rate_item_3: {type: Number, default: 0},
    // 風險
    rate_item_4: {type: Number, default: 0},
    // 調整
    rate_item_5: {type: Number, default: 0},

    memo: {
        type: String,
    },

    timestamp: {
        type: String,
    },

});