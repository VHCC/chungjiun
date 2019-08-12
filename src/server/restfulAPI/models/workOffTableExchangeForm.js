var mongoose = require('mongoose');

// 兌換單
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

    // 首周
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
    exchangeHour: {
        type: String,
    },
    // 月薪
    // 換算月薪定義：月薪/30/8
    userMonthSalary: {
        type: Number,
    },

    // 設定完成 Flag
    isConfirmed: {
        type: Boolean,
    }

});