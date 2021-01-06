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

    // income: {
    //     type: Number,
    //     default: 0
    // },

    // 11 輸入
    otherCost: {
        type: Number,
        default: 0
    },

    // 費率
    // 技師費
    rate_item_1: {type: Number},
    // 行政
    rate_item_2: {type: Number},
    // 利潤
    rate_item_3: {type: Number},
    // 風險
    rate_item_4: {type: Number},
    // 調整
    rate_item_5: {type: Number},

    memo: {
        type: String,
    },

    isPrjClose: {
        type: Boolean,
        default: false
    },

    timestamp: {
        type: String,
    },

    // 預計收入
    preIncome: {
        type: Number,
        default: 0
    },

    // 預計支出
    preCost: {
        type: Number,
        default: 0
    },

    // memo
    overAllMemo: {
        type: String
    },

    is011Set: {
        type: Boolean,
        default: false
    }


});