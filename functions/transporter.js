const nodemailer = require('nodemailer');
const server = require('../config');

exports.transporter = nodemailer.createTransport({
  service: server.EMAIL_SERVICE,
  port: server.EMAIL_PORT,
  secure: true,
  auth: {
      user: server.EMAIL_USER,
      pass: server.EMAIL_PASSWORD
  }
});