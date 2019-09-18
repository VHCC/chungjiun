var mongoose = require('mongoose');

module.exports = mongoose.model('PaymentFormItem', {
    // 填表人
    creatorDID: {
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

    // 專案ＤＩＤ
    prjDID: {
        type: String,
    },
    // 發票日期
    payDate: {
        type: String,
    },
    // 發票號碼
    receiptCode: {
        type: String,
    },

    //內容說明
    contents : {
        type: String,
    },

    // 金額
    amount: {
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

    // 行政新增
    isExecutiveAdd: {
        type: Boolean,
        default: false,
    },

    // 核定編號
    itemIndex: {
        type: Number,
        default: 0
    },

});