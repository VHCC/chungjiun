var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');


var appFormSchema = new Schema({


    // 年分
    year: {
        type: Number,
    },

    userDID: {
        type: String
    },

    timestamp: {
        type: String,
    },

    // settings: [new Schema({
    //     // 專案ＤＩＤ
    //     prjDID: {type: String},
    //     distribute: {
    //         type: Number,
    //         default: 0
    //     },
    // }, {strict: false})
    // ]
}, {strict: false});

module.exports = mongoose.model('KpiTechDistribute', appFormSchema);