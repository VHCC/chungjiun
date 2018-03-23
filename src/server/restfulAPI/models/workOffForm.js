var mongoose = require('mongoose');

module.exports = mongoose.model('WorkOffForm', {
    creatorDID: {
      type: String,
    },
    // 放假類別
    workOffType: {
      type: Number,
    },
    // 首周
    create_formDate: {
        type: String,
    },
    // 月份
    month: {
        type: Number,
    },
    // 日期
    day: {
        type: Number,
    },
    // 加班開始時間
    start_time: {
        type: Date,
    },
    // 加班結束時間
    end_time: {
        type: Date,
    },
    //狀態：已提交、尚未提交
    isSendReview: {
        type: Boolean,
        default: false,
    },
    //主管審核
    isBossCheck: {
        type: Boolean,
        default: false,
    },
    // 行政審核
    isExecutiveCheck: {
        type: Boolean,
        default: false,
    }


});