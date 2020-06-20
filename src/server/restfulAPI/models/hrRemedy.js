var mongoose = require('mongoose');
var moment = require('moment');

// 休假單
module.exports = mongoose.model('HrRemedy', {
    //填表人
    creatorDID: {
        type: String,
    },

    create_formDate: {
        type: String,
    },
    /**
     *
     * 補打卡類別
     *
     {
         name: "上班",
         type: 0
     },
     {
         name: "下班",
         type: 1
     },
     */
    remedyType: {
        type: Number,
        default: -1
    },
    // 年分
    year: {
        type: Number,
    },
    // 月份
    month: {
        type: Number,
    },
    date: {
        type: Number,
    },
    // 日
    day: {
        type: Number,
    },

    // 補打卡時間
    start_time: {
        type: String,
    },
    end_time: {
        type: String,
    },

    // 事由
    reason: {
        type: String,
    },

    //狀態：已提交、尚未提交
    isSendReview: {
        type: Boolean,
        default: false,
    },
    // 主管審核
    isBossCheck: {
        type: Boolean,
        default: false,
    },
    // 行政審核
    isExecutiveCheck: {
        type: Boolean,
        default: false,
    },

    // 月薪
    // 換算月薪定義：月薪/30/8
    userMonthSalary: {
        type: Number,
    },

    // 經理是否退回
    isBossReject: {
        type: Boolean,
        default: false,
    },

    // 經理退回事由
    bossReject_memo: {
        type: String,
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

    timestamp: {
        type : String,
    },

});