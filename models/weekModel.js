import mongoose from 'mongoose';
import periodModel from './periodModel';

const { Schema } = mongoose;

const weekSchema = new Schema({
  weekId: Number,
  monday: [periodModel],
  tuesday: [periodModel],
  wednesday: [periodModel],
  thursday: [periodModel],
  friday: [periodModel]
});

const Week = mongoose.model('Week', weekSchema);

export default Week;