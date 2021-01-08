var mongoose = require('mongoose');
var moment = require('moment');

module.exports = mongoose.model('SubContractorPayItem', {
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

    vendorName: {
        type: String,
    },

    // 委外項目ＤＩＤ
    itemDID: {
        type: String,
    },

    itemName: {
        type: String,
    },

    // 訂約DID
    subContractDID : {
        type: String,
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

    // ==================

    // 本期請款
    payApply: {
        type: String,
        default: "0"
    },

    // 說明
    payMemo: {
        type: String,
    },

    // 發票日期
    payDate: {
        type: String,
    },
    // 發票號碼
    receiptCode: {
        type: String,
    },

    // 撥款日期
    payConfirmDate: {
        type: String,
    },

    // 稅金
    payTax : {
        type: String,
        default: "0"
    },

    // 雜支
    payOthers: {
        type: String,
        default: "0"
    },

    // 行政審核
    isExecutiveCheck: {
        type: Boolean,
        default: false,
    },

    // 行政是否退回
    isExecutiveReject: {
        type: Boolean,
        default: false,
    },

    // 行政退回事由
    executiveReject_memo: {
        type: String,
    },

    // 行政備註
    executive_memo:{
        type: String,
    },

    isClosed: {
        type: Boolean,
        default: false
    },

    specialDate: {
        type: String,
    }


});