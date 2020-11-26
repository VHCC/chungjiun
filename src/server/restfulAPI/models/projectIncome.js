var mongoose = require('mongoose');
var moment = require('moment');

// 國定假日單
module.exports = mongoose.model('projectIncome', {
    // 年分
    year: {
        type: Number,
    },
    // 月份
    month: {
        type: Number,
    },

    // 是否已設定
    isEnable: {
        type: Boolean,
        default: false
    },

    // 專案ＤＩＤ
    prjDID: {
        type: String,
    },
    // 發票日期
    payDate: {
        type: String,
    },

    // 發票金額
    expectAmount: {
        type: String,
    },

    //請款內容
    payContents : {
        type: String,
    },

    // 入帳日期
    realDate : {
        type: String,
    },

    // 入帳金額
    // 移除，20201124 業主決議
    realAmount : {
        type: String,
    },

    // 匯費
    fee : {
        type: String,
    },

    // 罰款
    fines : {
        type: String,
    },

    // 備註
    memo: {
        type: String,
    },

    timestamp: {
        type : String,
    },
});