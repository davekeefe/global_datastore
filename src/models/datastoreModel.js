var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var datastoreModel = new Schema({
    name: {
        type: String
    },
    value: {
        type: Object
    }
});

module.exports = mongoose.model('DataStore', datastoreModel);
