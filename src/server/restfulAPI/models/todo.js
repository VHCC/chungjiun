var mongoose = require('mongoose');

module.exports = mongoose.model('Todo', {
    text: {
        type: String,
        default: ''
    },
    userDID: {
        type: String,
    },
    isEnable: {
        type: Boolean,
        default: true,
    },
    isChecked: {
        type: Boolean,
        default: false,
    }
});