const mongoose = require('mongoose');
const { Schema } = mongoose;

const notifSchema = new Schema({
  subject: String,
  time: String,
  date: String,
  cancelled: Boolean
}, { collection: 'notification' });

const Notif = mongoose.model('Notif', notifSchema);

module.exports = Notif;