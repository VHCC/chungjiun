var mongoose = require('mongoose');

module.exports = mongoose.model('WorkHourForm', {
    creatorDID: {
      type: String,
    },
    create_formDate: {
        type: String,
    },
    formTables: {
        type: Array,
    },
    

});