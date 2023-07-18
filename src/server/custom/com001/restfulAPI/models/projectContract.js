var mongoose = require('mongoose');
var moment = require('moment');

// 契約
module.exports = mongoose.model('ProjectContract', {

    instituteDID:{
        type: String,
        required: true,
    },

    // 無限制
    code: {
        type: String,
        required: true,
    },
    // 契約名稱
    name: {
        type: String,
        required: true
    },

    timestamp: {
        type : String,
    },

    updateTs: {
        type : String,
    },

    userUpdateTs: {
        type : String,
    },

    // 契約關閉 Flag
    enable : {
        type: Boolean,
        default: true,
    },

    // 新增
    contractMemo: {
        type: Array,
        default: []
    },

    mount: {
        type : String,
    },

    ext_mount: {
        type : String,
    },


    // 服務費率
    service_percent: {
        type : String,
    },
    // 評選日期
    date_1: {
        type : String,
    },
    // 決標日期
    date_2: {
        type : String,
    },
    // 議價日期
    date_3: {
        type : String,
    },
    // 訂約日期
    date_4: {
        type : String,
    },

    // 履約期限, 可提醒
    date_5: {
        type : String,
    },
    // 保險期限, 可提醒
    date_6: {
        type : String,
    },

    // 承辦機關
    boss: {
        type : String,
    },

    date5Enable : {
        type: Boolean,
        default: false,
    },
    date6Enable : {
        type: Boolean,
        default: false,
    },


});