const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.Mail_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.Notification_Mail_USER,
    pass: process.env.Notification_Mail_PASS,
  },
});

async function sendNotification(to, subject, htmlContent) {
  const mailOptions = {
    from: `"Bahta Express New Quote" <${process.env.Notification_Mail_USER}>`,
    to,
    subject,
    html: htmlContent,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    return { status: "success", message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email: ", error);
    return {
      status: "fail",
      message: "Error sending email",
      emailError: error.message,
    };
  }
}

module.exports = {
  sendNotification,
};
