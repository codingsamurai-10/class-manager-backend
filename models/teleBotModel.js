const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    chat_id: { type: Number },
    userName: String,
    firstName: String
}, { collection: 'telegram' });

const TeleUser = mongoose.model('telegram', userSchema);

module.exports = TeleUser;