const nodemailer = require('nodemailer')
const server = require('../config')
//let testAccount = await nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: server.MAIL,
    pass: server.MAIL_PASSWORD
  }
});

module.exports = transporter