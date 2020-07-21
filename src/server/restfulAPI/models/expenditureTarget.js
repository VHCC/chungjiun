var mongoose = require('mongoose');
var moment = require('moment');

// 支出項目
module.exports = mongoose.model('expenditureTarget', {

    targetName: {
        type: String,
        required: true,
    },

    isEnable: {
      type: Boolean,
      default: false
    },

    timestamp: {
        type : String,
    },

});