const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const emailBaseTemplate = require('../utils/emailBaseTemplate');

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: `${process.env.SENDER_EMAIL}`,
    pass: `${process.env.SENDER_PASSWORD}`,
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
