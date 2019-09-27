var mongoose = require('mongoose');

// 公文機關、廠商
module.exports = mongoose.model('officialDocVendor', {

    vendorName: {
        type: String,
        required: true,
    }


});