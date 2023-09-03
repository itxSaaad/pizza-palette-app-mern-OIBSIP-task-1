const Brevo = require('@getbrevo/brevo');

const defaultClient = Brevo.ApiClient.instance;

// Configure API key authorization: api-key
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey =
  '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';

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
