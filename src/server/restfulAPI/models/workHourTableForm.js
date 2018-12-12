var mongoose = require('mongoose');

module.exports = mongoose.model('WorkHourTableForm', {
    //填表人
    creatorDID: {
      type: String,
    },
    // 首周
    create_formDate: {
        type: String,
    },
    //專案DID
    prjDID: {
        type: String,
    },
    // MON
    mon_hour: {
        type: Number,
        default: 0,
    },
    mon_memo: {
        type: String,
    },
    mon_hour_add: {
        type: Number,
        default: 0,
    },
    mon_memo_add: {
        type: String,
    },
    // TUE
    tue_hour: {
        type: Number,
        default: 0,
    },
    tue_memo: {
        type: String,
    },
    tue_hour_add: {
        type: Number,
        default: 0,
    },
    tue_memo_add: {
        type: String,
    },
    // WES
    wes_hour: {
        type: Number,
        default: 0,
    },
    wes_memo: {
        type: String,
    },
    wes_hour_add: {
        type: Number,
        default: 0,
    },
    wes_memo_add: {
        type: String,
    },
    // THU
    thu_hour: {
        type: Number,
        default: 0,
    },
    thu_memo: {
        type: String,
    },
    thu_hour_add: {
        type: Number,
        default: 0,
    },
    thu_memo_add: {
        type: String,
    },
    // FRI
    fri_hour: {
        type: Number,
        default: 0,
    },
    fri_memo: {
        type: String,
    },
    fri_hour_add: {
        type: Number,
        default: 0,
    },
    fri_memo_add: {
        type: String,
    },
    // SAT
    sat_hour: {
        type: Number,
        default: 0,
    },
    sat_memo: {
        type: String,
    },
    sat_hour_add: {
        type: Number,
        default: 0,
    },
    sat_memo_add: {
        type: String,
    },
    // SUN
    sun_hour: {
        type: Number,
        default: 0,
    },
    sun_memo: {
        type: String,
    },
    sun_hour_add: {
        type: Number,
        default: 0,
    },
    sun_memo_add: {
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

    // 行政審核
    isExecutiveCheck: {
        type: Boolean,
        default: false,
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

    // 月薪
    // 換算月薪定義：月薪/30/8
    userMonthSalary: {
        type: Number,
    },







});