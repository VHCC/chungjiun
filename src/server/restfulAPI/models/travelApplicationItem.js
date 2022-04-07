var mongoose = require('mongoose');
var moment = require('moment');

// 休假單
module.exports = mongoose.model('travelApplicationItem', {
    //填表人
    creatorDID: {
        type: String,
    },

    prjDID: {
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

    // 出差開始日期
    taStartDate: {
        type: String,
    },

    // 出差開始時間
    start_time: {
        type: String,
    },

    // 出差結束日期
    taEndDate: {
        type: String,
    },

    // 出差結束時間
    end_time: {
        type: String,
    },

    applyHour: {
        type: String,
    },

    location: {
      type: String
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

    // 主管是否退回
    isBossReject: {
        type: Boolean,
        default: false,
    },

    // 主管退回事由
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

    updateTs: {
        type : String,
    },

    updateAction: {

    },

    // 經理審核
    isManagerCheck: {
        type: Boolean,
        default: false,
    },

    // 經理是否退回
    isManagerReject: {
        type: Boolean,
        default: false,
    },

    // 經理退回事由
    managerReject_memo: {
        type: String,
    },

});