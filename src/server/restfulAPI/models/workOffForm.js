var mongoose = require('mongoose');

module.exports = mongoose.model('WorkOffForm', {
    creatorDID: {
      type: String,
    },


});