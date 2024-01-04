var mongoose = require('mongoose');
var moment = require('moment');

module.exports = mongoose.model('ProjectFinancialResult', {

    // 年分
    year: {
        type: Number,
    },

    // 專案ＤＩＤ
    prjDID: {
        type: String,
    },

    // income: {
    //     type: Number,
    //     default: 0
    // },

    // 11 輸入
    otherCost: {
        type: Number,
        default: 0
    },

    // 費率
    // 技師費
    rate_item_1: {type: Number},
    // 行政 1
    rate_item_2: {type: Number},
    // 行政 2
    rate_item_21: {type: Number},

    // 利潤
    rate_item_3: {type: Number},
    // 風險
    rate_item_4: {type: Number},
    // 調整
    rate_item_5: {type: Number},

    memo: {
        type: String,
    },

    isPrjClose: {
        type: Boolean,
        default: false
    },

    timestamp: {
        type: String,
    },

    // 預計收入
    preIncome: {
        type: Number,
        default: 0
    },

    // 預計支出
    preCost: {
        type: Number,
        default: 0
    },

    // memo
    overAllMemo: {
        type: String
    },

    is011Set: {
        type: Boolean,
        default: false
    },

    kpi1: { <!-- 收入 -->
        type: Number,
        default: 0
    },

    kpi2: { <!-- 不含稅收入B=A/1.05 -->
        type: Number,
        default: 0
    },

    kpi3: { <!-- 公司調整(規劃、設計、監造廷整)C=B*調整值 -->
        type: Number,
        default: 0
    },

    kpi4: { <!-- 廠商請款(未稅金額) D -->
        type: Number,
        default: 0
    },
    kpi5: { <!-- 實際收入E=C-D -->
        type: Number,
        default: 0
    },
    kpi6: { <!-- 行政費 1 -->
        type: Number,
        default: 0
    },

    kpi61: { <!-- 行政費 2 202312 新增-->
        type: Number,
        default: 0
    },

    kpi7: { <!--技師費-->
        type: Number,
        default: 0
    },
    kpi8: { <!--風險-->
        type: Number,
        default: 0
    },
    kpi9: { <!--利潤-->
        type: Number,
        default: 0
    },
    kpi10: { <!-- 專案成本(墊付款、其他支出) --> <!-- (匯費、罰款) -->
        type: Number,
        default: 0
    },
    kpi11: {  <!--可分配金額-->
        type: Number,
        default: 0
    },
    kpi12: {  <!--執行成本-->
        type: Number,
        default: 0
    },
    kpi13: {  <!--績效結餘-->
        type: Number,
        default: 0
    },





});