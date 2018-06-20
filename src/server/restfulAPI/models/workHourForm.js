var mongoose = require('mongoose');

module.exports = mongoose.model('WorkHourForm', {
    //填表人
    creatorDID: {
      type: String,
    },
    // TODO
    // month
    // year
    // 首周
    create_formDate: {
        type: String,
    },
    //TODO end month
    // tableDID以及prjDID
    formTables: {
        type: Array,
    },
    

});