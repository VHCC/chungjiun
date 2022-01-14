var mongoose = require('mongoose');
var moment = require('moment');

module.exports = mongoose.model('KpiPersonQuerySetting', {
    // 年分
    year: {
        type: Number,
    },

    userDID: {
        type: String,
    },

    userDIDArray: {
      type: Array,
    },

    memo: {
        type: String,
    },

    timestamp: {
        type: String,
    },
});