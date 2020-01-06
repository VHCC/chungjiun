var mongoose = require('mongoose');

module.exports = function(fileDate) {

    var modelName = 'HrMachine' + "_" + fileDate;

    var mongoModel
    try {
        mongoModel = mongoose.model(modelName);
    } catch (error) {
        mongoModel = mongoose.model(modelName, {
            // 地區
            location: {
                type: String,
            },
            // 編號
            did: {
                type: String,
            },

            // 日期
            date: {
                type: String,
            },

            // 時間
            time: {
                type: String,
            },

            // 上下班狀態
            workType: {
                type: String,
            },

            // 打卡方式
            // F：指紋
            // G：GPS
            // P：卡片

            printType: {
                type: String,
            },

            gps_location: {
                type: String,
            },

            gps_type: {
                type: String,
            },

            gps_status: {
                type: String,
            }

        });
    }
    return mongoModel
}
