var mongoose = require('mongoose');
var moment = require('moment');

// 公文機關、廠商
module.exports = mongoose.model('officialDocVendor', {

    vendorName: {
        type: String,
        required: true,
    },

    isEnable: {
      type: Boolean,
      default: false
    },

    timestamp: {
        type : String,
        default: moment(new Date()).format("YYYYMMDD_HHmmss")
    },


});