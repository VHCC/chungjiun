var mongoose = require('mongoose');

module.exports = mongoose.model('HolidayDataForm', {
    // 表單擁有者
    creatorDID: {
        type: String,
    },
    // 年度
    year: {
        type: String,
    },
    start_sick: {type: String},
    start_private: {type: String},
    start_observed: {type: String},
    start_special: {type: String},
    start_married: {type: String},
    start_mourning: {type: String},
    start_official: {type: String},
    start_workinjury: {type: String},
    start_maternity: {type: String},
    start_paternity: {type: String},
    start_others: {type: String},

    end_sick: {type: String},
    end_private: {type: String},
    end_observed: {type: String},
    end_special: {type: String},
    end_married: {type: String},
    end_mourning: {type: String},
    end_official: {type: String},
    end_workinjury: {type: String},
    end_maternity: {type: String},
    end_paternity: {type: String},
    end_others: {type: String},

    calculate_sick: {type: String, default: 0},
    calculate_private: {type: String, default: 0},
    calculate_observed: {type: String, default: 0},
    calculate_special: {type: String, default: 0},
    calculate_married: {type: String, default: 0},
    calculate_mourning: {type: String, default: 0},
    calculate_official: {type: String, default: 0},
    calculate_workinjury: {type: String, default: 0},
    calculate_maternity: {type: String, default: 0},
    calculate_paternity: {type: String, default: 0},
    calculate_others: {type: String, default: 0},

    rest_sick: {type: String, default: 0},
    rest_private: {type: String, default: 0},
    rest_observed: {type: String, default: 0},
    rest_special: {type: String, default: 0},
    rest_married: {type: String, default: 0},
    rest_mourning: {type: String, default: 0},
    rest_official: {type: String, default: 0},
    rest_workinjury: {type: String, default: 0},
    rest_maternity: {type: String, default: 0},
    rest_paternity: {type: String, default: 0},
    rest_others: {type: String, default: 0},


});