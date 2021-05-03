import mongoose from 'mongoose';

const { Schema } = mongoose;

const periodSchema = new Schema({
  name: String,
  start: Number,
  end: Number
});

const Period = mongoose.model('Period', periodSchema);

const weekSchema = new Schema({
  weekId: Number,
  monday: [periodModel],
  tuesday: [periodModel],
  wednesday: [periodModel],
  thursday: [periodModel],
  friday: [periodModel]
}, {collection: 'periodsSchedule'});

const Week = mongoose.model('Week', weekSchema);

export default Week;