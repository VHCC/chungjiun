var mongoose = require('mongoose');
var moment = require('moment');

module.exports = mongoose.model('WageItem', {

    // 薪資所屬
    creatorDID: {
        type: String,
    },

    // 年分
    year: {
        type: Number,
    },
    // 月份
    month: {
        type: Number,
    },

    //狀態：已核定
    isConfirm: {
        type: Boolean,
        default: false,
    },

    // 月薪
    wgae_item_1: {type: String, default: "0"},
    wgae_item_2: {type: String, default: "0"},
    wgae_item_3: {type: String, default: "0"},
    wgae_item_4: {type: String, default: "0"},
    wgae_item_5: {type: String, default: "0"},
    // wgae_item_6: {type: String, default: "0"}, 請假
    wgae_item_7: {type: String, default: "0"},
    wgae_item_8: {type: String, default: "0"},
    wgae_item_9: {type: String, default: "0"},
    wgae_item_10: {type: String, default: "0"},
    wgae_item_11: {type: String, default: "0"},
    wgae_item_12: {type: String, default: "0"},
    wgae_item_12_title: {type: String},
    wgae_item_13: {type: String, default: "0"},
    wgae_item_13_title: {type: String},
    wgae_item_14: {type: String, default: "0"},
    wgae_item_14_title: {type: String},
    wgae_item_15: {type: String, default: "0"},
    wgae_item_15_title: {type: String},
    wgae_item_16: {type: String, default: "0"},
    wgae_item_16_title: {type: String},

    // 加班
    // withholding_item_1: {type: String, default: "0"}, 加班費（免稅）
    withholding_item_2: {type: String, default: "0"},
    withholding_item_3: {type: String, default: "0"},
    withholding_item_4: {type: String, default: "0"},
    withholding_item_5: {type: String, default: "0"},
    withholding_item_5_title: {type: String},

    // 獎金
    green_item_1: {type: String, default: "0"},
    green_item_2: {type: String, default: "0"},
    green_item_3: {type: String, default: "0"},
    green_item_4: {type: String, default: "0"},
    green_item_5: {type: String, default: "0"},
    green_item_6: {type: String, default: "0"},
    green_item_7: {type: String, default: "0"},
    green_item_8: {type: String, default: "0"},
    green_item_8_title: {type: String},
    green_item_9: {type: String, default: "0"},
    green_item_9_title: {type: String},
    green_item_10: {type: String, default: "0"},
    green_item_10_title: {type: String},

    // 工讀
    blue_item_1: {type: String, default: "0"},
    blue_item_1_hour: {type: String, default: "0"},
    blue_item_2: {type: String, default: "0"},
    blue_item_3: {type: String, default: "0"},
    blue_item_4: {type: String, default: "0"},
    blue_item_5: {type: String, default: "0"},
    blue_item_6: {type: String, default: "0"},
    blue_item_6_title: {type: String},
    blue_item_7: {type: String, default: "0"},
    blue_item_7_title: {type: String},

    timestamp: {
        type: String,
        default: moment(new Date()).format("YYYYMMDD_HHmmss")
    },

});