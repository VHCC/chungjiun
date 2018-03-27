var mongoose = require('mongoose');

// 休假單
module.exports = mongoose.model('WorkOffForm', {
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
    // tableDID
    formTables: {
        type: Array,
    },


});