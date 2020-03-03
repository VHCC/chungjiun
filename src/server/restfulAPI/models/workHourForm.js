var mongoose = require('mongoose');
var moment = require('moment');

module.exports = mongoose.model('WorkHourForm', {

    /**
     * 特殊規格，表單遇到跨月份，需要拆分成兩張表，不同month
     * 相同 首周
     */

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
    // 首周
    create_formDate: {
        type: String,
    },
    // tableDID以及prjDID
    formTables: {
        type: Array,
    },

    timestamp: {
        type : String,
    },
    

});