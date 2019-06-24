var mongoose = require('mongoose');

module.exports = mongoose.model('VhcUserEyeCheckInfo', {
    user_number: {
        type: String,
    },

    record_data:{
        type: String,
    },

    user_rightolds:{type: String,},
    user_rightoldc:{type: String,},
    user_rightolda:{type: String,},
    user_rightoldbc:{type: String,},
    user_rightoldadd:{type: String,},
    user_rightoldva:{type: String,},
    user_rightoldpd:{type: String,},

    user_leftolds:{type: String,},
    user_leftoldc:{type: String,},
    user_leftolda:{type: String,},
    user_leftoldbc:{type: String,},
    user_leftoldadd:{type: String,},
    user_leftoldva:{type: String,},
    user_leftoldpd:{type: String,},



});