var mongoose = require('mongoose');

module.exports = mongoose.model('WorkHourTableForm', {
    tableRowDiD: {
        type: String,
    },
    //填表人
    creatorDID: {
      type: String,
    },
    //專案DID
    prjDID: {
        type: String,
    },
    // MON
    mon_hour: {
        type: Number,
    },
    mon_memo: {
        type: String,
    },
    // TUE
    tue_hour: {
        type: Number,
    },
    tue_memo: {
        type: String,
    },
    // WES
    wes_hour: {
        type: Number,
    },
    wes_memo: {
        type: String,
    },
    // THU
    thu_hour: {
        type: Number,
    },
    thu_memo: {
        type: String,
    },
    // FRI
    fri_hour: {
        type: Number,
    },
    fri_memo: {
        type: String,
    },
    // SAT
    sat_hour: {
        type: Number,
    },
    sat_memo: {
        type: String,
    },
    // SUN
    sun_hour: {
        type: Number,
    },
    sun_memo: {
        type: String,
    },
    //狀態：已提交、尚未提交
    isSend: {
        type: Boolean
    },
    //經理審核
    managerCheck: {
        type: Boolean
    },
    // 行政審核
    executiveCheck: {
        type: Boolean
    }







});