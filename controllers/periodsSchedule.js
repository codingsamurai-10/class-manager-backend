const weekModel = require('../models/weekModel');

const preprocessTimeTable = data => {
    const periodsSchedule = [data.monday, data.tuesday, data.wednesday, data.thursday, data.friday];
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