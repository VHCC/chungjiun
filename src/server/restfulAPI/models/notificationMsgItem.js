var mongoose = require('mongoose');

// 系統通知
module.exports = mongoose.model('notificationMsgItem', {
    // 訊息成立時間
    timestamp: {
        type: Date,
    },
    creatorDID: {
        type: String,
    },

    msgTarget: {
        type: String,
    },

    // 訊息主題
    msgActionTopic: {
        type: Number
    },

    // 訊息細節
    msgActionDetail: {
        type: Number
    },

    msgMemo : {
        type: String
    },

    // 是否已讀
    isRead: {
        type: Boolean,
        default: false
    },
});