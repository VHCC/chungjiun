var mongoose = require('mongoose');
var moment = require('moment');

module.exports = mongoose.model('PaymentForm', {
    // 填表人
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
    // tableDID以及prjDID
    formTables: {
        type: Array,
    },

    timestamp: {
        type : String,
        default: moment(new Date()).format("YYYYMMDD_HHmmss")
    }

});