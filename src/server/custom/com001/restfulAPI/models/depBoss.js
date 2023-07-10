var mongoose = require('mongoose');
var moment = require('moment');

// 辦理階段項目選單
module.exports = mongoose.model('DepBoss', {

    depName: {
        type : String,
    },

    depType: {
        type : String,
    },

    userDID: {
        type : String,
    },

    updateTs: {
        type : String,
    },

});