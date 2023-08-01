var mongoose = require('mongoose');
var moment = require('moment');

// 工程
module.exports = mongoose.model('ProjectCase', {

    contractDID:{
        type: String,
        required: true,
    },

    instituteDID:{
        type: String,
        required: true,
    },
    // 無限制
    code: {
        type: String,
        required: true,
    },
    // 工程名稱
    name: {
        type: String,
        required: true
    },

    timestamp: {
        type : String,
    },

    updateTs: {
        type: String,
    },

    userUpdateTs: {
        type: String,
    },

    // 工程關閉 Flag
    enable : {
        type: Boolean,
        default: true,
    },

    // 新增
    caseMemo: {
        type: Array,
        default: []
    },

    // 工程地點
    // position: {
    //     type : String,
    // },

    // 承辦機關
    // caseBoss: {
    //     type : String,
    // },

    // 核定金額
    // approved_mount: {
    //     type : String,
    // },

    // 基設日期
    date_1: {
        type : String,
    },

    // 細設日期
    date_2: {
        type : String,
    },

    // 決標日期
    date_3: {
        type : String,
    },

    // 決標金額
    date_3_mount: {
        type : String,
    },

    // 變更日期
    date_4: {
        type : String,
    },

    // 請款日期
    date_5: {
        type : String,
    },

    // 請款類型
    // 鑽探
    payType_1: {
        type: Boolean,
        default: false,
    },

    // 設計
    payType_2: {
        type: Boolean,
        default: false,
    },

    // 監造
    payType_3: {
        type: Boolean,
        default: false,
    },

    // 尾款
    payType_4: {
        type: Boolean,
        default: false,
    },

    // 請款金額
    pay_mount: {
        type : String,
    },

    // 開發票
    // 請款
    is_bill_apply : {
        type: Boolean,
        default: false,
    },

    // 開發票
    // 入帳
    is_bill_count : {
        type: Boolean,
        default: false,
    },

});