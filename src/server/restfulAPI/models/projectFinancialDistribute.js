var mongoose = require('mongoose');
var moment = require('moment');

module.exports = mongoose.model('ProjectFinancialDistribute', {

    // Year
    year: {
        type: String,
    },

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

    // 可分配金額
    canDistributeAmount: {
        type: Number,
        default: 0
    },

    // 工時
    costHour: {
        type: Number,
        default: 0
    },

    // 執行成本
    cost: {
        type: Number,
        default: 0
    },

    // 分配績效
    distributeBonus: {
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