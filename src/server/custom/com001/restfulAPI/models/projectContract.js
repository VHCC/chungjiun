var mongoose = require('mongoose');
var moment = require('moment');

// 契約
module.exports = mongoose.model('ProjectContract', {

    instituteDID:{
        type: String,
        required: true,
    },

    // 無限制
    code: {
        type: String,
        required: true,
    },
    // 契約名稱
    name: {
        type: String,
        required: true
    },

    timestamp: {
        type : String,
    },

    updateTs: {
        type : String,
    },

    userUpdateTs: {
        type : String,
    },

    // 契約關閉 Flag
    enable : {
        type: Boolean,
        default: true,
    },

    contractMemo: {
        type: Array,
        default: []
    },

    mount: {
        type : String,
    },

    ext_mount: {
        type : String,
    }

});