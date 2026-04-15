const { sendNotification } = require("../utils/Emails/sendNotification");
const {
  QuoteNotificationTemplate,
} = require("../utils/Emails/Template/QuoteNotification");
const UserService = require("./user.service");

async function sendQuoteNotificationToActiveUsers(quote) {
  try {
    const activeUserEmails = await UserService.getActiveUsersEmails();

    if (activeUserEmails.length === 0) {
      // console.log("No active users to send notification to.");
      return;
    }

    const emailContent = QuoteNotificationTemplate(quote);

    for (const email of activeUserEmails) {
      const subject = "New Quote Request Notification";
      const response = await sendNotification(email, subject, emailContent);
      if (response.status === "success") {
        // console.log(`Notification sent to: ${email}`);
      } else {
        console.error(
          `Failed to send notification to: ${email}, Error: ${response.message}`
        );
      }
    }
  } catch (error) {
    console.error("Error sending quote notification to active users: ", error);
  }
}
module.exports = {
  sendQuoteNotificationToActiveUsers,
};
