
const nodemailer = require("nodemailer");


const sendEmail = async (Options) => {

  let testAccount = await nodemailer.createTestAccount();

  
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port:  process.env.SMTP_PORT,
    secure: false, 
    auth: {
      user:  process.env.SMTP_EMAIL, 
      pass: process.env.SMTP_PASSWORD 
    }
  });

  // send mail with defined transport object
  let message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // sender address
    to: Options.email, // list of receivers
    subject: Options.subject, // Subject line
    text: Options.message, // plain text body
  };
  const info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);

}

module.exports = sendEmail;

