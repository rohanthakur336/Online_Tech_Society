const mongoose = require('mongoose'),
    passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const loginSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: 'member',
        enum: ['admin','head','member'] 
    }
});

loginSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', loginSchema);