var mongoose = require('mongoose');

// 休假單
module.exports = mongoose.model('workOffTableExchangeForm', {
    //填表人
    creatorDID: {
        type: String,
    },
    /**
     *
     * 兌換類別
     *
         {
             name: "補休",
             type: 2
         },
         {
             name: "特休",
             type: 3
         },
     */
    workOffType: {
        type: Number,
        default: -1
    },
    // 提交首周
    create_formDate: {
        type: String,
    },
    // 提交年分
    year: {
        type: Number,
    },
    // 提交月份
    month: {
        type: Number,
    },
    // 提交日
    day: {
        type: Number,
    },
    //兌換數值
    value: {
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