var mongoose = require('mongoose');
var moment = require('moment');

module.exports = mongoose.model('User', {

    // 登入帳號
    email: {
        type: String
    },

    // CJ Mail
    cjMail: {
        type: String
    },

    //登入密碼
    password: {
        type: String
    },
    //員工姓名
    name: {
        type: String
    },

    // 員工職務
    roleType: {
        type: Number
    },

    // 部門
    depType: {
        type: String
    },

    // 主管ID
    bossID: {
        type: String,
    },

    // 月薪
    // 換算月薪定義：月薪/30/8
    userMonthSalary: {
        type: Number,
        default: 0
    },

    // 打卡機編號
    machineDID: {
        type: String,
    },

    // 在職狀態
    workStatus: {
        type: Boolean,
        default: false
    },

    // 補休
    residualRestHour: {
        type: String,
        default: 0
    },

    // 設定過補休
    isSetResidualRestHour: {
        type: Boolean,
        default: false
    },

    feature_official_doc: {
        type: Boolean,
        default: false
    },

    // 2021/12/22 add
    before108Kpi: {
        type: Number,
        default: 0
    },

    timestamp: {
        type: String,
    },

    updateTs: {
        type: String,
    },

    passwordChangeTs: {
        type: String,
    },

    isChangedPWD: {
        type: Boolean,
    },

    pwdChangeUserName: {
        type: String,
    }

});