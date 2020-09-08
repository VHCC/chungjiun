var mongoose = require('mongoose');
var moment = require('moment');

// 委外項目
module.exports = mongoose.model('subContractorItem', {

    subContractorItemName: {
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