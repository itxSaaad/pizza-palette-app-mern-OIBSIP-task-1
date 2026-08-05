const path = require('path');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const emailBaseTemplate = require('../utils/emailBaseTemplate');

// Resolved relative to this file, not process.cwd() — see index.js for why.
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const SMTP_HOST = process.env.NODEMAILER_SMTP_HOST || process.env.SMTP_HOST || 'smtp.zoho.com';
const SMTP_PORT = Number(process.env.NODEMAILER_SMTP_PORT || process.env.SMTP_PORT || 465);
const SMTP_SECURE_VALUE = process.env.NODEMAILER_SMTP_SECURE || process.env.SMTP_SECURE;
const SMTP_SECURE = SMTP_SECURE_VALUE
  ? SMTP_SECURE_VALUE === 'true'
  : SMTP_PORT === 465;
const SMTP_EMAIL = process.env.NODEMAILER_SMTP_EMAIL || process.env.SENDER_EMAIL;
const SMTP_PASSWORD = process.env.NODEMAILER_SMTP_PASSWORD || process.env.SENDER_PASSWORD;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASSWORD,
  },
});

/**
 * sendEmail - Sends a professional HTML email using the base template
 * @param {Object} options - { to, subject, templateOptions, from, text }
 * templateOptions: { title, greeting, message, actionText, actionUrl, closing, signature, extra }
 */
const sendEmail = async ({ to, subject, templateOptions = {}, from, text }) => {
  try {
    const html = emailBaseTemplate(templateOptions);
    const mailOptions = {
      from: from || SMTP_EMAIL,
      to,
      subject,
      html,
      text: text || templateOptions.message || '',
    };
    const response = await transporter.sendMail(mailOptions);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent!');
  }
};

module.exports = sendEmail;
