const mongoose = require('mongoose');

const { Schema } = mongoose;

const periodSchema = new Schema({
  name: String,
  start: Number,
  end: Number
});

const weekSchema = new Schema({
  weekId: Number,
  monday: [periodSchema],
  tuesday: [periodSchema],
  wednesday: [periodSchema],
  thursday: [periodSchema],
  friday: [periodSchema]
}, {collection: 'periodsSchedule'});

const Week = mongoose.model('Week', weekSchema);

module.exports = Week;