const conn = require("../config/db.config");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const {
  getOTPByEmail,
  getUserByEmail,
  checkActiveStatus,
} = require("../utils/Auth/auth.helper");
const { sendEmail } = require("../utils/Emails/sendEmail");
const { generateOTPEmailContent } = require("../utils/Emails/Template/OTP");

async function logIn(userData) {
  try {
    const user = await getUserByEmail(userData.user_email);

    if (!user || !user.data || user.data.length === 0) {
      return {
        status: "fail",
        message: "This email does not exist. Please check and try again.",
      };
    }

    const userRecord = user.data[0];

    const passwordMatch = await bcrypt.compare(
      userData.user_pass,
      userRecord.user_password_hashed
    );

    if (!passwordMatch) {
      return {
        status: "fail",
        message: "The password is not correct. Please check and try again.",
      };
    }

    const isActive = await checkActiveStatus(userRecord.user_email);

    if (!isActive) {
      return {
        status: "fail",
        message:
          "Your account is currently inactive. Please contact your administrator.",
      };
    }

    // ✅ SUCCESS → return user data directly
    return {
      status: "success",
      data: userRecord,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "fail",
      message: "Login failed due to server error",
    };
  }
}

async function verifyOTP(email, enteredOTP) {
  try {
    const result = await conn.query(
      "SELECT token FROM otp_requests WHERE email = ?",
      [email]
    );

    if (result.length === 0) {
      return {
        success: false,
        message: "OTP not found for this email. Please request a new one.",
      };
    }

    const savedOTP = result[0].token;

    if (enteredOTP === savedOTP) {
      return { success: true, message: "OTP verified successfully." };
    } else {
      return { success: false, message: "OTP is incorrect. Please try again." };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while verifying the OTP.",
    };
  }
}

async function deleteOTP(email) {
  try {
    const result = await conn.query(
      "DELETE FROM otp_requests WHERE email = ?",
      [email]
    );
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
async function deleteExpiredOTPs() {
  try {
    const currentTime = new Date();
    const expirationTime = 5 * 60 * 1000;

    const result = await conn.query(
      "DELETE FROM otp_requests WHERE created_at < ?",
      [new Date(currentTime - expirationTime)]
    );
    return true;
  } catch (error) {
    console.error("Error deleting expired OTPs:", error);
    return false;
  }
}

async function deleteExpiredPasswordResetRequests() {
  try {
    const currentTime = new Date();
    const expirationTime = 15 * 60 * 1000;

    const result = await conn.query(
      "DELETE FROM password_reset_requests WHERE created_at < ?",
      [new Date(currentTime - expirationTime)]
    );

    return true;
  } catch (error) {
    console.error("Error deleting expired password reset requests:", error);
    return false;
  }
}

async function generateAndSendOTP(email, userFirstName) {
  try {
    const generatedOTP = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const emailContent = generateOTPEmailContent(generatedOTP, userFirstName);

    const sendEmailStatus = await sendEmail(
      email,
      "Kordi Your One-Time Password",
      emailContent
    );
    await conn.query("INSERT INTO otp_requests (token, email) VALUES ( ?, ?)", [
      generatedOTP,
      email,
    ]);

    return {
      otp: sendEmailStatus ? generatedOTP : null,
      status: sendEmailStatus.status,
    };
  } catch (error) {
    console.error("Error generating and resending OTP:", error);
    throw error;
  }
}

module.exports = {
  logIn,
  verifyOTP,
  deleteOTP,
  generateAndSendOTP,
  deleteExpiredOTPs,
  deleteExpiredPasswordResetRequests,
};
