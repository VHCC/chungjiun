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

    // 來文機關
    vendorDID: {
        type: String,
        required: true,
    },

    // 來文日期
    receiveDate: {
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
        default: "",
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
    archiveNumber: {
        type: String,
        required: true,
    },

    // 文號字
    _receiveType: {
        type: String,
        required: true,
    },

    // 文號編號
    receiveNumber: {
        type: String,
        required: true,
    },

    // 文別
    // 0 : 函
    // 1 : 會勘
    // 2 : 開會
    docType: {
        type: Number,
        required: true,
    },

    // 辦理情形, 另立追蹤Schema
    // processing: {
    //     type: String,
    //     default: ""
    // },

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