const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Email setup
let mailTransporter = null;
if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  mailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

// Twilio setup
let twilioClient = null;
if (process.env.TWILIO_SID && process.env.TWILIO_AUTH && process.env.TWILIO_FROM) {
  twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
}

async function sendEmailAlert(to, subject, text) {
  if (!mailTransporter) {
    console.warn('Email credentials missing – skipping email alert');
    return false;
  }
  try {
    await mailTransporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
      to,
      subject,
      text
    });
    return true;
  } catch (err) {
    console.error('Email alert error', err);
    return false;
  }
}

async function sendSmsAlert(to, body) {
  if (!twilioClient) {
    console.warn('Twilio credentials missing – skipping SMS alert');
    return false;
  }
  try {
    await twilioClient.messages.create({
      body,
      from: process.env.TWILIO_FROM,
      to
    });
    return true;
  } catch (err) {
    console.error('SMS alert error', err);
    return false;
  }
}

module.exports = { sendEmailAlert, sendSmsAlert };