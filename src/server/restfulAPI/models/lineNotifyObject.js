var mongoose = require('mongoose');

// 系統通知
module.exports = mongoose.model('lineNotifyObject', {
    // 首周
    timestamp: {
        type: String,
    },
    creatorDID: {
        type: String,
    },

    // 是否已讀
    isRead: {
        type: Boolean,
        default: false
    },
});