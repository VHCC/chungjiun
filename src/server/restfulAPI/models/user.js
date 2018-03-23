var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    // 登入帳號
    email: {
        type: String
    },
    //登入密碼
    password: {
        type: String
    },
    //員工姓名
    name: {
        type: String
    },
    //
    // value="1">技師
    // value="2">經理
    // value="3">工程師
    // value="4">行政
    // value="5">工讀生
    // value="100">行政總管
    // 員工角色
    roleType: {
        type: Number
    },
    bossID: {
        type: String,
    }

});