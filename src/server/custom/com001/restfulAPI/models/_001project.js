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

    // 專案資料新增
    unitMemo: {
        type: Array,
        default: []
    },

    // 鑽探日期
    drill_date:{
        type : String,
    },

    // 基設日期
    date_1_ext: {
        type : String,
    },

    // 細設日期
    date_2_ext: {
        type : String,
    },

    // 發包日期
    pack_date:{
        type : String,
    },

    // 施工廠商
    pack_company:{
        type : String,
    },

    // 開工日期
    start_date:{
        type : String,
    },

    // 完工日期
    done_date:{
        type : String,
    },

    // 預定進度
    predict_process:{
        type : String,
    },

    // 實際進度
    real_process:{
        type : String,
    },

    // 驗收日期
    check_date:{
        type : String,
    },

    // 結算日期
    pay_end_date:{
        type : String,
    },

    // 變更日期
    change_date:{
        type : String,
    },

    // 變更金額
    change_amount:{
        type : String,
    },



    // 開發票
    // 請款
    is_bill_apply : {
        type: Boolean,
        default: false,
    },

    // 開發票
    // 入帳
    is_bill_count : {
        type: Boolean,
        default: false,
    },



    // 工程地點 (從工程基本進入)
    position: {
        type : String,
    },

    // 承辦機關 (從工程基本進入)
    caseBoss: {
        type : String,
    },

    // 核定金額 (從工程基本進入)
    approved_mount: {
        type : String,
    },

    // 工程基本資料的專案新增資料
    unitMemoByCase: {
        type: Array,
        default: []
    },

});