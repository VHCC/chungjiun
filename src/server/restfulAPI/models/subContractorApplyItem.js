var mongoose = require('mongoose');
var moment = require('moment');

module.exports = mongoose.model('SubContractorApplyItem', {
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

    // 委外廠商ＤＩＤ
    vendorDID: {
        type: String,
    },

    // 委外項目ＤＩＤ
    itemDID: {
        type: String,
    },

    // 訂約日期
    contractDate: {
        type: String,
    },

    //內容說明
    contents : {
        type: String,
    },

    // 訂約金額
    contractAmount: {
        type: String,
        default: 0,
    },

    //狀態：已提交、尚未提交
    isSendReview: {
        type: Boolean,
        default: false,
    },

    // 經理審核
    isManagerCheck: {
        type: Boolean,
        default: false,
    },

    // 經理是否退回
    isManagerReject: {
        type: Boolean,
        default: false,
    },

    // 經理退回事由
    managerReject_memo: {
        type: String,
    },

    timestamp: {
        type : String,
    },

});