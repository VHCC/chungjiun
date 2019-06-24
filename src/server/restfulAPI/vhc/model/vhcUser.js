var mongoose = require('mongoose');

module.exports = mongoose.model('VhcUser', {
    user_id: {
        type: Number
    },
    user_number: {
        type: String,
    },
    user_name:{
        type: String,
    },
    user_sex:{
        type: String,
    },
    user_birth: {
        type: String,
    },
    user_mobile:{
        type: String,
    },
    user_homephone:{type: String,},
    user_officephone:{type: String,},
    user_email:{type: String,},
    user_address:{type: String,},
    user_memo:{type: String,},

});