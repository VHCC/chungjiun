var mongoose = require('mongoose');
var moment = require('moment');

// 工程
module.exports = mongoose.model('ProjectCase', {

    contractDID:{
        type: String,
        required: true,
    },

    instituteDID:{
        type: String,
        required: true,
    },
    // 無限制
    code: {
        type: String,
        required: true,
    },
    // 工程名稱
    name: {
        type: String,
        required: true
    },

    timestamp: {
        type : String,
    },

    updateTs: {
        type: String,
    },

    userUpdateTs: {
        type: String,
    },

    caseMemo: {
        type: Array,
        default: []
    },

});