var mongoose = require('mongoose');

//加班單
module.exports = mongoose.model('workHourTableFormWorkAdd', {
    //填表人
    creatorDID: {
      type: String,
    },
    // 類別
    workAddType: {
        type: Number,
    },
    // 首周
    create_formDate: {
        type: String,
    },
    //專案DID
    prjDID: {
        type: String,
    },
    // 月
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
    // 薪水
    userHourSalary: {
        type: Number,
    },
    // 事由
    reason: {
        type: String,
    }





});