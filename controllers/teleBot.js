const { Telegraf } = require('telegraf');
const userModel = require('../models/teleBotModel');

const TOKEN = process.env.BOT_TOKEN;
if (TOKEN === undefined) { throw new Error('INVALID TOKEN') }

const bot = new Telegraf(TOKEN);
bot.launch()
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
const findUsers = async () => {
    const data = await userModel.find({})
    return data;
}
const sendNotifications = (changes) => {
    bot.start((ctx) => {
        ctx.reply('Welcome to Class Manager Telegram Bot')
        userModel.exists({ chat_id: ctx.message.from.id }, (err, res) => {
            if (err) { console.log(err) }
            else {
                if (!res) {
                    userModel.create({
                        chat_id: ctx.message.from.id,
                        userName: ctx.message.from.username,
                        firstName: ctx.message.from.first_name
                    })
                }
            }
        })
        ctx.reply(`Hi ${ctx.message.from.first_name}, this bot is linked to:\n[Class Manager](https://class-time-table-manager.herokuapp.com/) application `, { parse_mode: "MarkdownV2" })
    })
    let message = `New message:\n${changes['subject']} is ${(changes['cancelled']) ? `cancelled` : `scheduled`} for ${changes['date']} at ${changes['time']}`;
    findUsers()
        .then((res) => {
            res.map((user) => {
                bot.telegram.sendMessage(user['chat_id'], message);
            })
        })
}


module.exports = sendNotifications;