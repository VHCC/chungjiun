var mongoose = require('mongoose');

module.exports = mongoose.model('Project', {
    // 分支主題
    // P 服務建議書
    // C 已成案
    branch: {
        type: String,
        required: true,
    },
    // 年度
    //OOO
    year: {
        type: String,
        required: true,
    },
    // 總案
    //OO
    code: {
        type: String,
        required: true,
    },
    // 類型：
    // 規劃 00
    // 設計 01
    // 監造 02
    // 服務 03
    // 行政 04
    // 投標 05
    // 總案 06
    // 其他 07
    // O
    type: {
        type: String,
        required: true,
    },
    // 專案編碼
    // O + OOO + OO + O + OO 共 9 碼
    prjCode: {
        type: String,
        required: true
    },
    // 專案名稱
    name: {
        type: String,
        required: true
    },
    // 承辦人員，經理級
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
    // endDate : {
    //     type: Date
    // }

});