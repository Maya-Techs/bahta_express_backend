const {
  getUserByEmail,
  generateResetToken,
} = require("../utils/Auth/auth.helper");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../utils/Emails/sendEmail");
const {
  storeResetToken,
  updatePassword,
  changePWD,
  checkResetToken,
} = require("../services/password_reset.service");

const {
  generatePasswordResetEmailContent,
} = require("../utils/Emails/Template/ResetPassword");

async function requestPasswordReset(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        status: "fail",
        message: "Email is required",
      });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const checkResetReq = await checkResetToken(email);

    if (checkResetReq) {
      return res.status(400).json({
        status: "fail",
        message:
          "Reset request has already been sent. Please check your email. It may take a few minutes to arrive. If not, please wait 15 minutes before requesting again.",
      });
    }
    const firstName = user && user.data[0].user_first_name;
    const resetToken = generateResetToken(email);
    const resetLink = `${process.env.DASHBOARD_FRONTEND_URL}/pages/change-password?token=${resetToken}`;
    const emailContent = generatePasswordResetEmailContent(
      resetLink,
      firstName
    );
    const sendEmailStatus = await sendEmail(
      email,
      "Bahta Express Password Reset Request",
      emailContent
    );

    if (sendEmailStatus.status === "fail") {
      return res.status(500).json({
        status: "error",
        message: "Failed to send password reset email. Please try again later.",
      });
    }

    await storeResetToken(email, resetToken);

    res.status(200).json({
      status: "success",
      message: `Password reset email sent to ${email}. Please check your email.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const user = await getUserByEmail(email);

    if (!user || user.data.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await updatePassword(email, hashedPassword);

    res.status(200).json({
      status: "success",
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({
        status: "fail",
        message: "Session expired. Please request a new password reset link",
      });
    }
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { user_email, user_id } = req;

    const user = await getUserByEmail(user_email);

    if (!user || !user.data || user.data.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    if (Number(user.data[0].user_id) !== Number(user_id)) {
      return res.status(403).json({
        status: "fail",
        message: "You are not authorized to change the password",
      });
    }

    const result = await changePWD(newPassword, oldPassword, user_email);

    if (result.status === "fail") {
      return res.status(400).json({
        status: "fail",
        message: result.message,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Password has been changed successfully!",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = {
  requestPasswordReset,
  resetPassword,
  changePassword,
};
