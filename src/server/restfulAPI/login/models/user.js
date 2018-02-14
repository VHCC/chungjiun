var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    email: {
        type: String
    },
    password: {
        type: String
    },
    roleType: {
        type: Number,
        default: 0
    }
});