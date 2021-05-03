const weekModel = require('../models/weekModel');

const findFreeSlots = daySchedule => {
  let freeSlots = [];
  if(daySchedule[0].start > 8) freeSlots.push({start: 8, end: daySchedule[0].start});
  for(let i = 1; i < daySchedule.length; ++i) {
    if(daySchedule[i].start > daySchedule[i - 1].end) freeSlots.push({start: daySchedule[i - 1].end, end: daySchedule[i].start});
  }
  const lastElement = daySchedule[daySchedule.length - 1];
  if(lastElement.end < 17) freeSlots.push({start: lastElement.end, end: 17});
  return freeSlots;
}

const addFreeSlots = daySchedule => {
  let updatedSchedule = [];
  const freeSlots = findFreeSlots(daySchedule);
  let freeSlotIndex = 0, dayScheduleIndex = 0;
  while(freeSlotIndex < freeSlots.length && dayScheduleIndex < daySchedule.length) {
    if(freeSlots[freeSlotIndex].start < daySchedule[dayScheduleIndex].start) {
      updatedSchedule.push(freeSlots[freeSlotIndex]);
      freeSlotIndex++;
    }
    else {
      updatedSchedule.push(daySchedule[dayScheduleIndex]);
      dayScheduleIndex++;
    }
  }

  while(freeSlotIndex < freeSlots.length) {
    updatedSchedule.push(freeSlots[freeSlotIndex]);
    freeSlotIndex++;
  }
  while(dayScheduleIndex < daySchedule.length) {
    updatedSchedule.push(daySchedule[dayScheduleIndex]);
    dayScheduleIndex++;
  }

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
  getPeriodsSchedule,
  getFreeSlotsForBooking
};