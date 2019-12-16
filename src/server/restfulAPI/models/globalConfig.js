var mongoose = require('mongoose');

// 系統通知
module.exports = mongoose.model('globalConfig', {
    // 墊付款開啟與否
    paymentsSwitch: {
        type: Boolean,
        default: true,
    },
});