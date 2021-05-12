const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const userModel = require('../models/userModel')
const CLIENT_ID = process.env.MAIL_CLIENT_ID
const CLIENT_SECRET = process.env.MAIL_CLIENT_SECRET
const REDIRECT_URI = process.env.MAIL_REDIRECT_URI
const REFRESH_TOKEN = process.env.MAIL_REFRESH_TOKEN
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })
async function sendMail(changes) {
    try {
        const accessToken = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'app.classmanager@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })
        const message = `New message:\n${changes['subject']} is ${(false) ? `cancelled` : `scheduled for ${changes['date']} at ${changes['time']}`}`
        const htmlMessage =
        `<div style="border: 5px black solid;">
            <div
                style="background: black;
                color: white;
                text-align: center;
                padding: 8px 10px;"
                >
                ${(changes['cancelled'])?'Cancelled':'Scheduled'}
            </div>
            <div style="padding: 2px 10px;">
                <p><b>Subject: </b>${changes['subject']}</p>
			    <p><b>Timing: </b>${changes['time']}</p>
                <p><b>Date: </b>${changes['date']}</p>
            </div>  
        </div>`
        const users = await userModel.find({})
        users.forEach(async (user) => {
            await transport.sendMail({
                from: 'app.classmanager@gmail.com',
                to: user['email'],
                subject: 'Class Manager Notification',
                text: message,
                html: htmlMessage
            })
        })
    } catch (error) {
        return error;
    }
}

module.exports = sendMail;