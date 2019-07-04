const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Media = new Schema({
    // fileURL: {
    //     type: String,
    //     unique: true
    // },
    filename: {
        type: String,
        unique: true
    },
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    uploader: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        email: String,
        firstName: String,
        lastName: String
    },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Media', Media);