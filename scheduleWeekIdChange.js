const schedule = require('node-schedule');
const weekModel = require('./models/weekModel');
const mongoose = require('mongoose');

const job = schedule.scheduleJob('0 0 * * 6', () => {
  weekModel.findOneAndDelete({ weekId: 1 })
  .then(doc => console.log(doc));

  weekModel.findOne({ weekId: 2 })
    .then(doc => {
      if (doc) {
        doc.weekId = 1;
        doc.save();
      }
    });

  weekModel.findOne({ weekId: 0 })
    .then(doc => {
      const cloneDoc = doc;
      cloneDoc.isNew = true;
      cloneDoc.weekId = 2;
      cloneDoc._id = mongoose.Types.ObjectId();
      cloneDoc.save();
    });
});