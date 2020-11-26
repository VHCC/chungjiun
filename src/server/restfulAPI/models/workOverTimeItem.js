var mongoose = require('mongoose');
var moment = require('moment');

// 加班申請
module.exports = mongoose.model('workOverTimeItem', {

    //填表人
    creatorDID: {
        type: String,
    },

    prjDID: {
        type: String,
    },

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

    contents: {
        type: String,
    },

    //狀態：已提交、尚未提交
    isSendReview: {
        type: Boolean,
        default: false,
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

    // 月薪
    // 換算月薪定義：月薪/30/8
    userMonthSalary: {
        type: Number,
    },

    timestamp: {
        type : String,
    },

    isExecutiveSet: {
        type: Boolean,
        default: false,
    }

});