const weekModel = require('../models/weekModel');
const notifModel = require('../models/notifModel');

const findFreeSlots = daySchedule => {
  if (daySchedule.length == 0) {
    return [{ start: 8, end: 17 }];
  }
  let freeSlots = [];
  if (daySchedule[0].start > 8) freeSlots.push({ start: 8, end: daySchedule[0].start });
  for (let i = 1; i < daySchedule.length; ++i) {
    if (daySchedule[i].start > daySchedule[i - 1].end) freeSlots.push({ start: daySchedule[i - 1].end, end: daySchedule[i].start });
  }
  const lastElement = daySchedule[daySchedule.length - 1];
  if (lastElement.end < 17) freeSlots.push({ start: lastElement.end, end: 17 });
  return freeSlots;
}

const addFreeSlots = daySchedule => {
  let updatedSchedule = [];
  const freeSlots = findFreeSlots(daySchedule);
  let freeSlotIndex = 0, dayScheduleIndex = 0;
  while (freeSlotIndex < freeSlots.length && dayScheduleIndex < daySchedule.length) {
    if (freeSlots[freeSlotIndex].start < daySchedule[dayScheduleIndex].start) {
      updatedSchedule.push(freeSlots[freeSlotIndex]);
      freeSlotIndex++;
    }
    else {
      updatedSchedule.push(daySchedule[dayScheduleIndex]);
      dayScheduleIndex++;
    }
  }

  while (freeSlotIndex < freeSlots.length) {
    updatedSchedule.push(freeSlots[freeSlotIndex]);
    freeSlotIndex++;
  }
  while (dayScheduleIndex < daySchedule.length) {
    updatedSchedule.push(daySchedule[dayScheduleIndex]);
    dayScheduleIndex++;
  }

  return updatedSchedule;
}

const preprocessTimeTable = data => {
  const periodsSchedule = [data.monday, data.tuesday, data.wednesday, data.thursday, data.friday];
  for (let i = 0; i < 5; ++i) {
    periodsSchedule[i] = addFreeSlots(periodsSchedule[i]);
  }
  return periodsSchedule;
}

const getPeriodsSchedule = (req, res, next) => {
  weekModel.findOne({ weekId: 1 })
    .then(data => {
      return preprocessTimeTable(data);
    })
    .then(arr => {
      return JSON.stringify(arr);
    })
    .then(json => res.send(json));
};

const getDayFromNumber = num => {
  switch (num) {
    case 1: return "monday";
    case 2: return "tuesday";
    case 3: return "wednesday";
    case 4: return "thursday";
    case 5: return "friday";
  }
}

const findAllFittingSlots = (slotsOfGivenDuration, durationWanted, slot) => {
  const duration = slot.end - slot.start;
  if (duration < durationWanted) return;
  if (duration == durationWanted) {
    slotsOfGivenDuration.push(slot);
    return;
  }
  slotsOfGivenDuration.push({ start: slot.start, end: slot.start + durationWanted * 1 }); // * 1 is intended to force JS to treat durationWanted as a number
  const newSlot = { start: slot.start + 1, end: slot.end };
  findAllFittingSlots(slotsOfGivenDuration, durationWanted, newSlot);
}

const findSlotsOfGivenDuration = (freeSlots, duration) => {
  let slotsOfGivenDuration = [];
  for (let i = 0; i < freeSlots.length; ++i) {
    findAllFittingSlots(slotsOfGivenDuration, duration, freeSlots[i]);
  }
  return slotsOfGivenDuration;
}

const getFirstDayOfWeekFromDate = date => {
  return date.getDate() - date.getDay() + 1;
}

const getWeekAndDayOfDate = (date) => {
  let weekId = 2;
  if (getFirstDayOfWeekFromDate(date) == getFirstDayOfWeekFromDate(new Date())) weekId = 1;

  let dayOfSlot = getDayFromNumber(date.getDay());
  return { weekId, dayOfSlot };
}

const getFreeSlotsForBooking = (req, res, next) => {
  const slotDuration = req.body.slotDurationWanted;
  const slotDate = new Date(req.body.dateOfSlotWanted);

  const { weekId, dayOfSlot } = getWeekAndDayOfDate(slotDate);

  weekModel.findOne({ weekId: weekId })
    .then(data => {
      return findFreeSlots(data[dayOfSlot]);
    })
    .then(slots => {
      const slotsOfGivenDuration = findSlotsOfGivenDuration(slots, slotDuration);
      return JSON.stringify(slotsOfGivenDuration);
    })
    .then(jsonResponse => {
      res.send(jsonResponse);
    });
}

const compareByStartTime = (slot1, slot2) => {
  if (slot1.start > slot2.start) {
    return 1;
  }
  if (slot1.start < slot2.start) {
    return -1;
  }
  return 0;
}

const bookSlot = (req, res, next) => {
  const subjectName = req.body.subjectName;
  const slotDate = new Date(req.body.dateOfSlotWanted);
  const slotTime = req.body.slotSelected;
  const duration = req.body.slotDurationWanted;

  const { weekId, dayOfSlot } = getWeekAndDayOfDate(slotDate);

  const newSlot = {
    name: subjectName,
    start: slotTime,
    end: slotTime + duration * 1
  };

  weekModel.findOne({ weekId: weekId })
    .then(doc => {
      try {
        doc[dayOfSlot].push(newSlot);
        doc[dayOfSlot].sort(compareByStartTime);
      }
      catch (err) {
        res.status(400);
        res.end();
      }
      doc.save()
        .then(() => {
          res.status(200);
          res.end();
          notifModel.create(
            {
              subject: newSlot.name,
              time: newSlot.start.toString() + ":00",
              date: slotDate.getDate() + "/" + slotDate.getMonth()+"/" + slotDate.getFullYear(),
              cancelled: false
            }, (err, res)=>{
              if(err) console.log(err);
            })
        })
        .catch(() => {
          res.status(400);
          res.end();
        });
    });
}

const cancelSlot = (req, res, next) => {
  const slotDate = new Date(req.body.slotToCancel);
  const startTime = req.body.hour;
  const { weekId, dayOfSlot } = getWeekAndDayOfDate(slotDate);
  let subname;
  weekModel.findOne({ weekId: weekId })
    .then(doc => {
      if (!doc) throw "Document not found";
      const numOfPeriods = doc[dayOfSlot].length;
      let indexOfPeriodWithGivenStart = 0;
      for (; indexOfPeriodWithGivenStart < numOfPeriods; ++indexOfPeriodWithGivenStart) {
        if (doc[dayOfSlot][indexOfPeriodWithGivenStart].start == startTime) {
          subname = doc[dayOfSlot][indexOfPeriodWithGivenStart].name;
          break;
        };
      }
      if (indexOfPeriodWithGivenStart == numOfPeriods) {
        res.status(400);
        res.end();
      }
      else {
        doc[dayOfSlot].splice(indexOfPeriodWithGivenStart, 1);
        doc.save();
        res.status(200);
        res.end();
        notifModel.create(
            {
              subject: subname,
              time: startTime.toString() + ":00",
              date: slotDate.getDate() + "/" + slotDate.getMonth()+"/" + slotDate.getFullYear(),
              cancelled: true
            }, (err, res)=>{
              if(err) console.log(err);
            })
      }
    })
    .catch(() => {
      res.status(400);
      res.end();
    });
}

module.exports = {
  getPeriodsSchedule,
  getFreeSlotsForBooking,
  bookSlot,
  cancelSlot
};