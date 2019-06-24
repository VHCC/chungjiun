var mongoose = require('mongoose');

module.exports = mongoose.model('VhcPurchaseRecord', {
    user_number: {type: String,},

    purchase_recorddate:{type: String,},

    purchase_rights:{type: String,},
    purchase_rightc:{type: String,},
    purchase_righta:{type: String,},
    purchase_rightbc:{type: String,},
    purchase_rightadd:{type: String,},
    purchase_rightpd:{type: String,},


    purchase_lefts:{type: String,},
    purchase_leftc:{type: String,},
    purchase_lefta:{type: String,},
    purchase_leftbc:{type: String,},
    purchase_leftadd:{type: String,},
    purchase_leftpd:{type: String,},

    purchase_f:{type: String,},
    purchase_fprice:{type: String,},
    purchase_l:{type: String,},
    purchase_lprice:{type: String,},



});