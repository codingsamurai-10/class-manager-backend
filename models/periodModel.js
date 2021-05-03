import mongoose from 'mongoose';
const { Schema } = mongoose;

const periodSchema = new Schema({
  name: String,
  start: Number,
  end: Number
});

const Period = mongoose.model('Period', periodSchema);

export default Period;