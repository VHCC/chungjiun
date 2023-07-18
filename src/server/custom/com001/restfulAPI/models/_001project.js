var mongoose = require('mongoose');
var moment = require('moment');

module.exports = mongoose.model('_001Project', {
    // 分支主題
    // P-投標；C-得標；M-管理
    branch: {
        type: String,
        required: true,
    },

    contractDID:{
        type: String,
        required: true,
    },

    instituteDID:{
        type: String,
        required: true,
    },

    caseDID: {
        type: String,
        required: true,
    },

    // 編碼
    //OO
    code: {
        type: String,
        required: true,
    },
    // 類型：
    // 2022/07/09
    // 1-設計；2-監造；3-規劃；4-專管；5-管理；6-投標；7-其他
    // 1.設計
    // 2.監造
    // 3.規劃
    // 4.專管
    // 5.管理
    // 6.投標
    // 7.其他

    type: {
        type: String,
        required: true,
    },

    // 專案負責人員
    managerID: {
        type: String,
        required: true
    },
    // 承辦人員
    majorID: {
        type: String,
    },
    // 協辦人員
    workers : {
        type: Array,
        default: []
    },
    //技師
    technician: {
        type: Array,
        default: []
    },

    // 專案狀態 Flag
    enable : {
        type: Boolean,
        default: true,
    },

    // 專案可看
    viewable: {
        type: Boolean,
        default: true
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

    // 新增
    unitMemo: {
        type: Array,
        default: []
    },

});