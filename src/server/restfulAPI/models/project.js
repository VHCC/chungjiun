var mongoose = require('mongoose');

module.exports = mongoose.model('Project', {
    //編碼方式
    // prjCode = year + code + type + 流水號
    // 年度
    year: {
        type: String
    },
    // 總案號
    code: {
        type: String
    },
    // 類型：總案、規劃、設計、監造、服務
    type: {
        type: String
    },
    // 專案編碼
    prjCode: {
        type: String
    },
    // 專案名稱
    name: {
        type: String
    },
    // 承辦人員
    majorID: {
        type: String
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
    enable : {
        type: Boolean
    }

});