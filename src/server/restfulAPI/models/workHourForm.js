var mongoose = require('mongoose');

module.exports = mongoose.model('WorkHourForm', {
    //填表人
    creatorDID: {
      type: String,
    },
    // 首周
    create_formDate: {
        type: String,
    },
    // tableDID以及prjDID
    formTables: {
        type: Array,
    },
    

});