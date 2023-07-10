var mongoose = require('mongoose');
var moment = require('moment');

// 辦理階段項目選單
module.exports = mongoose.model('CaseTask', {
    creatorDID: {
        type: String,
        required: true,
    },
    //
    title: {
        type: String,
    },

    contents:{
        type: String,
    },

    memo: {
        type: String,
    },

    timestamp: {
        type : String,
    },

    enable: {
        type: Boolean,
        default: false
    },

    updateTs: {
        type : String,
    },

    userUpdateTs: {
        type : String,
    },

});