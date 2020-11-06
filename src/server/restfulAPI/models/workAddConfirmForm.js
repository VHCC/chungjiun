var mongoose = require('mongoose');
var moment = require('moment');

// 加班分配表 文惠專用
module.exports = mongoose.model('WorkAddConfirmForm', {
    //填表人
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
    formTables: {
        type: String,
    },

    timestamp: {
        type : String,
    },


});