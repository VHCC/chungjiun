var mongoose = require('mongoose');

module.exports = mongoose.model('Temp', {

    tempID: {
      type: String,
    },
    creatorDID: {
        type: String,
    }




});