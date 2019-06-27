const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String
    },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', User);