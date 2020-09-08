var mongoose = require('mongoose');
var moment = require('moment');

// 委外廠商
module.exports = mongoose.model('subContractorVendor', {

    subContractorVendorName: {
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