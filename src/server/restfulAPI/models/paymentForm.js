var mongoose = require('mongoose');

module.exports = mongoose.model('PaymentForm', {
    creatorDID: {
      type: String,
    },
    prjDID: {
        type: String,
    },
    payDate: {
        type: Date,
    },
    receiptCode: {
        type: String,
    },
    amount: {
        type: String,
    },

});