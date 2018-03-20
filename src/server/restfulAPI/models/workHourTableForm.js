var mongoose = require('mongoose');

module.exports = mongoose.model('WorkHourTableForm', {
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
    mon_hour_add: {
        type: Number,
    },
    mon_memo_add: {
        type: String,
    },
    // TUE
    tue_hour: {
        type: Number,
    },
    tue_memo: {
        type: String,
    },
    tue_hour_add: {
        type: Number,
    },
    tue_memo_add: {
        type: String,
    },
    // WES
    wes_hour: {
        type: Number,
    },
    wes_memo: {
        type: String,
    },
    wes_hour_add: {
        type: Number,
    },
    wes_memo_add: {
        type: String,
    },
    // THU
    thu_hour: {
        type: Number,
    },
    thu_memo: {
        type: String,
    },
    thu_hour_add: {
        type: Number,
    },
    thu_memo_add: {
        type: String,
    },
    // FRI
    fri_hour: {
        type: Number,
    },
    fri_memo: {
        type: String,
    },
    fri_hour_add: {
        type: Number,
    },
    fri_memo_add: {
        type: String,
    },
    // SAT
    sat_hour: {
        type: Number,
    },
    sat_memo: {
        type: String,
    },
    sat_hour_add: {
        type: Number,
    },
    sat_memo_add: {
        type: String,
    },
    // SUN
    sun_hour: {
        type: Number,
    },
    sun_memo: {
        type: String,
    },
    sun_hour_add: {
        type: Number,
    },
    sun_memo_add: {
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