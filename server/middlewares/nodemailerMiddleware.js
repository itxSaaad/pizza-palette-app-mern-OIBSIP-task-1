const path = require('path');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const emailBaseTemplate = require('../utils/emailBaseTemplate');

// Resolved relative to this file, not process.cwd() — see index.js for why.
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

// SMTP provider settings are configurable via env vars so the mail
// provider can be swapped (Gmail, Zoho, etc.) without a code change.
// Defaults to Zoho Mail's global (US) data center settings.
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.zoho.com';
const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
const SMTP_SECURE = process.env.SMTP_SECURE
  ? process.env.SMTP_SECURE === 'true'
  : SMTP_PORT === 465;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
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
      from: from || process.env.SENDER_EMAIL,
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
