var mongoose = require('mongoose');
var moment = require('moment');

// 機關
module.exports = mongoose.model('Institute', {
    // 10 碼
    code: {
        type: String,
        required: true,
    },
    // 機關名稱
    name: {
        type: String,
        required: true
    },

    timestamp: {
        type : String,
    },

    updateTs: {
        type : String,
    },

    userUpdateTs: {
        type : String,
    },

});