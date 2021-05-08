const notifModel = require('../models/notifModel');

const getNotifications = async (req, res) => {
    try {
        const data = await notifModel.find({}).sort({ _id: -1}).exec();
        res.send(data);
    } catch (err) {
        console.log(err);
    }
}

module.exports = getNotifications;