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


    // O
    // 設計 01
    // 監造 02
    // 規劃 03
    // 服務 04
    // 總案 05
    // 專案管理 06
    // 其他 07

    // ======= 20190117
    // 1.設計
    // 2.監造
    // 3.規劃
    // 4.專管
    // 5.總案
    // 6.服務
    // 7.行政
    // 8.(空白)
    // 9.其他


    type: {
        type: String,
        required: true,
    },
    // 專案編碼
    // O + OOO(年度) + OO(總案) + OO(專案) + OO(子案) + O(類型) 共 11 碼
    prjCode: {
        type: String,
        required: true
    },
    // 專案名稱
    mainName: {
        type: String,
        required: true
    },
    // 專案負責人員，經理級
    managerID: {
        type: String,
        required: true
    },
    // 承辦人員，經理級
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
    // 專案關閉 Flag
    enable : {
        type: Boolean,
    },
    // 到期日
    // endDate : {
    //     type: Date
    // }

    // 專案編號
    // OO
    prjNumber: {
        type: String,
        required: true,
    },
    //專案名稱
    prjName: {
        type: String,
    },
    // 子岸編號
    // OO
    prjSubNumber: {
        type: String,
        required: true,
    },
    //子案名稱
    prjSubName: {
        type: String,
    },
});