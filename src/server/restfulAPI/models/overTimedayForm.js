var mongoose = require('mongoose');

// 補班日
module.exports = mongoose.model('overTimeDayForm', {
    // 首周
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

    // 是否已設定
    isEnable: {
        type: Boolean,
        default: false
    },
});