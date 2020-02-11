var mongoose = require('mongoose');
var moment = require('moment');

// 收文、發文項目
module.exports = mongoose.model('officialDocItem', {

    // 建檔人
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
        // required: true,
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

    // 機關發文日期
    officialPublicDate: {
        type: String,
    },

    // 收文日期
    receiveDate: {
        type: String,
        // required: true,
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

    // 簽核人
    signerDID: {
        type: String,
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

    // 分部
    // 0 : F
    // 1 : N
    // 2 : G
    // 3 : D
    // 4 : P
    docDivision: {
        type: Number,
    },

    // 文別
    // 0 : 函
    // 1 : 會勘
    // 2 : 開會
    // 3 : 書函
    // 4 : 紀錄
    docType: {
        type: Number,
    },

    // 經理是否允許歸檔
    isApproveDocClose: {
        type: Boolean,
        default: false
    },

    // 是否歸檔
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

    // 附件類別
    // 0 : 無
    // 1 : 電子
    // 2 : 紙本
    docAttachedType: {
        type: Number,
    },

    // 是否有附件
    isAttached: {
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


    // 0 : 電子
    // 1 : 紙本
    // 發文屬性
    publicType: {
        type: Number,
    },

    // 發文日期 (可以為空)
    publicDate: {
        type: String,
    },

    // 是否被同意發文
    isDocCanPublic: {
        type: Boolean,
        default: false
    },

    // 是否發文歸檔
    isDocPublic: {
        type: Boolean,
        default: false
    },

    // 正本
    targetOrigin: {
        type: Array,
    },

    // 副本
    targetCopy: {
        type: Array,
    },

    // 資料類
    // 0 : 收文
    // 1 : 發文
    type: {
        type: Number,
        require: true
    },


    // 會簽
    isCounterSign: {
        type: Boolean,
        default: false
    },

    counterSignList: {
        type: Array,
    }







});