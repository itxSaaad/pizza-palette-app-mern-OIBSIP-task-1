const Brevo = require('@getbrevo/brevo');
const dotenv = require('dotenv');

dotenv.config();

const defaultClient = Brevo.ApiClient.instance;

// Configure API key authorization: api-key
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = `${process.env.BREVO_API_KEY}`;

var apiInstance = new Brevo.TransactionalEmailsApi();

const sendEmail = async (mailOptions) => {
  try {
    const sendSmtpEmail = new Brevo.SendSmtpEmail({
      sender: {
        name: 'Pizza Palette',
        email: mailOptions.from,
      },
      subject: mailOptions.subject,
      htmlContent: mailOptions.text,
      to: [
        {
          email: mailOptions.to,
        },
      ],
    });

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(response);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

module.exports = sendEmail;
