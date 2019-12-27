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
    //
    // value="1">技師
    // value="2">經理
    // value="3">工程師
    // value="4">行政
    // value="5">工讀生
    // value="100">行政總管
    // 員工角色
    roleType: {
        type: Number
    },
    // 主管ID
    bossID: {
        type: String,
    },
    // 時薪（不使用）
    // userHourSalary: {
    //     type: Number,
    //     default: 0,
    // },

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

    timestamp: {
        type : String,
        default: moment(new Date()).format("YYYYMMDD_HHmmss")
    },

});