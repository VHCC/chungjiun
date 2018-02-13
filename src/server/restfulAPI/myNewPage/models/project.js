var mongoose = require('mongoose');

module.exports = mongoose.model('Project', {
    name: {
        type: String,
        default: ''
    },
    id: {
        type: Number
    },
    majorOwner: {
        type: String,
        default: ''
    },
    enable: {
        type: Boolean,
        default: true
    }

});