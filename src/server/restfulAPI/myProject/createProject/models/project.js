var mongoose = require('mongoose');

module.exports = mongoose.model('Project', {
    code: {
        type: String
    },
    name: {
        type: String
    },
    majorID: {
        type: String
    },
    creator: {
        type: String
    }

});