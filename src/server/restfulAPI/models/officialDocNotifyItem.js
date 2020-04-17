var mongoose = require('mongoose');
var moment = require('moment');

// 收文、發文項目
module.exports = mongoose.model('officialDocNotifyItem', {

    // 建檔人
    creatorDID: {
        type: String,
        required: true,
    },

    targetDID: {
        type: String,
        required: true,
    },

    // 崇峻文號
    archiveNumber: {
        type: String,
    },

    // 分部
    // 0 : F
    // 1 : N
    // 2 : G
    // 3 : D
    // 4 : P
    docDivision: {
        type: Number,
    },

    notifyMsg: {
        type: String,
    },

    // 是否閱讀
    isDocOpened: {
        type: Boolean,
        default: false
    },


    // 物件建立時間點
    timestamp: {
        type : String,
    },


    // 資料類
    // 0 : 收文
    // 1 : 發文
    type: {
        type: Number,
        require: true
    },


});