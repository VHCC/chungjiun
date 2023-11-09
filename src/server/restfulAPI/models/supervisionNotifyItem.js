var mongoose = require('mongoose');

// 系統通知
module.exports = mongoose.model('supervisionNotifyItem', {

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
    date: {
        type: Number,
    },

    // 日
    day: {
        type: Number,
    },

    start_time: {
        type: String,
    },

    // 是否已發送
    isSend: {
        type: Boolean,
        default: false
    },

    isSetup: {
        type: Boolean,
        default: false
    },

    msg: {
        type: String
    },

    // 時間點
    timestamp: {
        type: String,
    },
});