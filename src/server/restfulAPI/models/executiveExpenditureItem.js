var mongoose = require('mongoose');
var moment = require('moment');

module.exports = mongoose.model('ExecutiveExpenditureItem', {
    // 填表人
    creatorDID: {
      type: String,
    },

    // 年分
    year: {
        type: Number,
    },

    // 月份
    month: {
        type: Number,
    },

    // 專案ＤＩＤ
    prjDID: {
        type: String,
    },

    // 支出項目ＤＩＤ
    targetDID: {
        type: String,
    },
    // 支出項目 Name
    targetName: {
        type: String,
    },

    // 日期
    payDate: {
        type: String,
    },

    // 發票號碼
    receiptCode: {
        type: String,
    },

    //內容說明
    contents : {
        type: String,
    },

    // 金額
    amount: {
        type: String,
    },

    //狀態：已提交、尚未提交
    isSendReview: {
        type: Boolean,
        default: false,
    },

    // 核定編號
    itemIndex: {
        type: Number,
        default: 0
    },

    timestamp: {
        type : String,
    },

});