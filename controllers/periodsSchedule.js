const weekModel = require('../models/weekModel');

const addFreeSlots = daySchedule => {
  let updatedSchedule = [];
  if(daySchedule[0].start > 8) updatedSchedule.push({name: "free", start: 8, end: daySchedule[0].start});
  updatedSchedule.push(daySchedule[0]);
  for(let i = 1; i < daySchedule.length; ++i) {
    const lastElement = updatedSchedule[updatedSchedule.length - 1];
    if(lastElement.end < daySchedule[i].start) updatedSchedule.push({name: "free", start: lastElement.end, end: daySchedule.start});
    updatedSchedule.push(daySchedule[i]);
  }
  const lastElement = updatedSchedule[updatedSchedule.length - 1];
  if(lastElement.end < 17) updatedSchedule.push({name: "free", start: lastElement.end, end: 17});
  return updatedSchedule;
}

const preprocessTimeTable = data => {
  const periodsSchedule = [data.monday, data.tuesday, data.wednesday, data.thursday, data.friday];
  for(let i = 0; i < 5; ++i) {
    periodsSchedule[i] = addFreeSlots(periodsSchedule[i]);
  }
  return periodsSchedule;
}

const getPeriodsSchedule = (req, res, next) => {
  weekModel.findOne({ weekId: 0 })
    .then(data => {
      return preprocessTimeTable(data);
    })
    .then(arr => {
      return JSON.stringify(arr);
    })
    .then(json => res.send(json));
};

module.exports = {
  getPeriodsSchedule
};