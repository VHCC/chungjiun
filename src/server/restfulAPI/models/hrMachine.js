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
            date: {
                type: String,
            },
            time: {
                type: String,
            },
            workType: {
                type: String,
            },
            printType: {
                type: String,
            }
        });
    }
    return mongoModel
}
