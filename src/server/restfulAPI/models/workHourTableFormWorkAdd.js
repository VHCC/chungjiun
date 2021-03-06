var mongoose = require('mongoose');
var moment = require('moment');

//加班單
module.exports = mongoose.model('workHourTableFormWorkAdd', {
    //填表人
    creatorDID: {
      type: String,
    },
    // 類別
    // 1: 加班
    // 2: 換休
    workAddType: {
        type: Number,
    },
    // 首周
    create_formDate: {
        type: String,
    },
    //專案DID
    prjDID: {
        type: String,
    },
    year: {
        type: Number,
    },
    // 月
    month: {
        type: Number,
    },
    // 日
    day: {
        type: Number,
    },
    // 休假開始時間
    start_time: {
        type: String,
    },
    // 休假結束時間
    end_time: {
        type: String,
    },
    // 時薪（不使用）
    // userHourSalary: {
    //     type: Number,
    // },

    // 月薪
    // 換算月薪定義：月薪/30/8
    userMonthSalary: {
        type:Number,
        default: 0
    },
    // 事由
    reason: {
        type: String,
    },
    isExecutiveConfirm: {
        type: Boolean,
        default: false
    },

    // 加班倍數 1 + 0
    dis_1_0: {
        type: String,
        default: "0"
    },

    // 加班倍數 1 + 1/3
    dis_1_13: {
        type: String,
        default: "0"
    },

    // 加班倍數 1 + 2/3
    dis_1_23: {
        type: String,
        default: "0"
    },

    // 加班倍數 1 + 1
    dis_1_1: {
        type: String,
        default: "0"
    },

    timestamp: {
        type : String,
    }





});