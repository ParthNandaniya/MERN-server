const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    date: { type: Date, default: Date.now },
    media: {
        type: Array
    }
    // lastLogin: { type: Date }
});

module.exports = mongoose.model('User', User);