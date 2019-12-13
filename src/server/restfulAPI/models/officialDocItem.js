var mongoose = require('mongoose');
var moment = require('moment');

// 收文、發文項目
module.exports = mongoose.model('officialDocItem', {

    // 收文人（收發人員）
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

    // 來文機關DID
    vendorDID: {
        type: String,
        required: true,
    },

    // 專案ＤＩＤ
    prjDID: {
        type: String,
        required: true,
    },

    prjCode: {
        type: String,
        required: true,
    },

    // 來文日期
    receiveDate: {
        type: String,
        required: true,
    },

    // 內部處理期限 receiveDate + 3
    lastDate: {
        type: String,
    },

    // 正本處理期限 (可以為空)
    dueDate: {
        type: String,
    },

    // 關卡處理人
    handlerDID: {
        type: String,
        required: true,
    },

    // 文負責人
    chargerDID: {
        type: String,
        required: true,
    },


    // 主旨
    subject: {
        type: String,
        default: ""
    },

    // 崇峻文號
    archiveNumber: {
        type: String,
    },

    // 文號字
    receiveType: {
        type: String,
    },

    // 文號編號
    receiveNumber: {
        type: String,
    },

    // 文別
    // 0 : 函
    // 1 : 會勘
    // 2 : 開會
    docType: {
        type: Number,
        required: true,
    },

    // 經理是否允許簽結
    isApproveDocClose: {
        type: Boolean,
        default: false
    },

    // 是否簽結
    isDocClose: {
        type: Boolean,
        default: false
    },

    // 是否閱讀
    isDocOpened: {
        type: Boolean,
        default: false
    },

    // 是否審核關卡
    isDocSignStage: {
        type: Boolean,
        default: false
    },

    // 處理情形
    stageInfo: {
        type: Array,
    },

    // 物件建立時間點
    timestamp: {
        type : String,
    },






});