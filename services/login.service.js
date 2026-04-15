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
    let returnData = {};
    const user = await getUserByEmail(userData.user_email);
    const password = user.data[0].user_password_hashed;
    const email = user.data[0].user_email;
    if (user.length === 0) {
      returnData = {
        status: "fail",
        message: "This email does not exist. Please check and try again.",
      };
      return returnData;
    }
    const passwordMatch = await bcrypt.compare(userData.user_pass, password);
    if (!passwordMatch) {
      returnData = {
        status: "fail",
        message: "The password is not correct. Please check and try again.",
      };
      return returnData;
    }
    const isActive = await checkActiveStatus(email);
    if (!isActive) {
      returnData = {
        status: "fail",
        message:
          "Your account is currently inactive. If you believe this is an error, please contact your administrator for assistance.",
      };
      return returnData;
    }
    const existingOTP = await getOTPByEmail(email);
    if (existingOTP !== null) {
      return {
        status: "success",
        message: "OTP already sent",
      };
    }
    const generatedOTP = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const firstName = user.data[0].user_first_name;
    const emailContent = generateOTPEmailContent(generatedOTP, firstName);
    const sendEmailStatus = await sendEmail(
      email,
      "Bahta Express Your One-Time Password",
      emailContent
    );
    if (sendEmailStatus.status === "success") {
      await conn.query(
        "INSERT INTO otp_requests (token, email) VALUES (?, ?)",
        [generatedOTP, email]
      );
    }
    returnData = {
      status: "success",
      data: user.data[0],
      emailStatus: sendEmailStatus,
    };
    return returnData;
  } catch (error) {
    console.error(error);
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
