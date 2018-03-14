var mongoose = require('mongoose');

module.exports = mongoose.model('Project', {
    //編碼方式
    // prjCode = year + code + type + 流水號
    // 年度
    year: {
        type: String,
        required: true
    },
    // 總案號
    code: {
        type: String,
        required: true
    },
    // 類型：總案、規劃、設計、監造、服務
    type: {
        type: String,
        required: true
    },
    // 專案編碼
    prjCode: {
        type: String,
        required: true
    },
    // 專案名稱
    name: {
        type: String,
        required: true
    },
    // 承辦人員
    majorID: {
        type: String,
        required: true
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
    // 專案關閉 Flag
    enable : {
        type: Boolean,
    },
    // 到期日
    endDate : {
        type: Date
    }

});