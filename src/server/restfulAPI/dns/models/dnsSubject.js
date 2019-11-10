var mongoose = require('mongoose');

module.exports = function() {
    var modelName = 'dnssubject';

    var mongoModel
    try {
        mongoModel = mongoose.model(modelName);
    } catch (error) {
        mongoModel = mongoose.model(modelName, {
            difficulty: {
                type: Number
            },

            isAdult: {
                type: Boolean
            },

            locale: {
                type: String,
            },

            content: {
                type : String,
            },
        });
    }
    return mongoModel
}