var mongoose = require('mongoose');
var moment = require('moment');

// 加班申請
module.exports = mongoose.model('workOverTimeItem', {

    //填表人
    creatorDID: {
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

    //狀態：已提交、尚未提交
    isSendReview: {
        type: Boolean,
        default: false,
    },

    // 月薪
    // 換算月薪定義：月薪/30/8
    userMonthSalary: {
        type: Number,
    },

    timestamp: {
        type : String,
    },

});