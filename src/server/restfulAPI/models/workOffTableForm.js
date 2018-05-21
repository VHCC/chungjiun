var mongoose = require('mongoose');

// 休假單
module.exports = mongoose.model('workOffTableForm', {
    //填表人
    creatorDID: {
        type: String,
    },
    // 放假類別
    workOffType: {
        type: Number,
        default: -1
    },
    // 首周
    create_formDate: {
        type: String,
    },
    // 年分
    year: {
        type: Number,
    },
    // 月份
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
    // 時薪（不使用）
    // userHourSalary: {
    //     type: Number,
    // },

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

});