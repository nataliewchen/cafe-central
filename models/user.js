const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'Cafe'
    }]
});

userSchema.plugin(passportLocalMongoose); // adds username, hash, hashed password, salt, etc.

module.exports = mongoose.model('User', userSchema);