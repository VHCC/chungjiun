var mongoose = require('mongoose');
var moment = require('moment');

// 收文、發文項目
module.exports = mongoose.model('officialDocItem', {
    // 填文人
    creatorDID: {
        type: String,
        required: true,
    },

    // 年分
    year: {
        type: Number,
        required: true,
    },

    // 月份
    month: {
        type: Number,
        required: true,
    },

    // 建檔日期
    createDate: {
        type: String,
        require: true,
    },

    // 來文機關
    vendorDID: {
        type: String,
        required: true,
    },

    // 來文日期
    sendDate: {
        type: String,
        required: true,
    },

    // 專案ＤＩＤ
    prjDID: {
        type: String,
        required: true,
    },

    // 處理期限 sendDate + 4
    dueDate: {
        type: String,
        required: true,
    },

    // 處理期限 sendDate + 6
    lastDate: {
        type: String,
        required: true,
    },

    chargerDID: {
        type: String,
        required: true,
    },

    // 主旨
    subject: {
        type: String,
        default: ""
    },

    // 總收文號
    docMain: {
        type: String,
        required: true,
    },

    // 文號字
    docTitle: {
        type: String,
        required: true,
    },

    // 文號編號
    docNumber: {
        type: String,
        required: true,
    },

    // 文號別
    // 0 : 函
    // 1 : 會勘
    // 2 : 開會
    docType: {
        type: Number,
        required: true,
    },

    // 辦理情形
    processing: {
        type: String,
        default: ""
    },

    // 簽結
    isDocClose: {
        type: Boolean,
        default: false
    },

    timestamp: {
        type : String,
        default: moment(new Date()).format("YYYYMMDD_HHmmss")
    },






});