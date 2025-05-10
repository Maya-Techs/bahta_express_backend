const loginService = require("../services/login.service");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const { getOTPByEmail, getUserByEmail } = require("../utils/Auth/auth.helper");

const LoginUser = {};
function maskEmail(email) {
  const [username, domain] = email.split("@");
  const maskedUsername = username.substring(0, 5) + "*****";
  return `${maskedUsername}@${domain}`;
}
async function logIn(req, res, next) {
  try {
    const userData = req.body;
    const userEmail = userData.user_email;

    const userExist = await getUserByEmail(req.body.user_email);
    if (!userExist) {
      return res.status(404).json({
        status: "fail",
        message:
          "User with this email does not exist. Please check and try again.",
      });
    }

    const user = await loginService.logIn(userData);
    if (user && user.status === "fail") {
      return res.status(403).json({
        status: user.status,
        message: user.message,
      });
    }

    if (user.message === "OTP already sent") {
      const maskedEmail = maskEmail(userEmail);
      return res.status(200).json({
        status: "success",
        message: `An OTP has already been sent to your email ${maskedEmail}. it is valid for 5 minutes.`,
        data: {
          user_email: userEmail,
          mask_email: maskedEmail,
        },
      });
    }

    if (user.emailStatus.status === "fail") {
      return res.status(400).json({
        status: "fail",
        message:
          "We are unable to send OTP to your email address at this time, please try again later.",
      });
    }

    LoginUser[user.data.user_email] = {
      user_id: user.data.user_id,
      user_email: user.data.user_email,
      user_role: user.data.company_role_id,
      user_first_name: user.data.user_first_name,
      user_last_name: user.data.user_last_name,
      user_phone: user.data.user_phone,
    };

    const maskedEmail = maskEmail(
      user.data.user_email || user.data.client_email
    );

    res.status(200).json({
      status: "success",
      message: `Check your email ${maskedEmail} for a one-time password to complete the verification process.`,
      data: {
        user_email: user.data.user_email || user.data.client_email,
        mask_email: maskedEmail,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
}

async function verifyOTPAndGenerateToken(req, res, next) {
  try {
    const user_email = req.body.email;
    const enteredOTP = req.body.otp;

    const storedUserData = LoginUser[user_email];

    if (!storedUserData) {
      return res.status(403).json({
        status: "fail",
        message: "session expired",
      });
    }
    const isOTPVerified = await loginService.verifyOTP(user_email, enteredOTP);

    if (isOTPVerified.success === false) {
      return res.status(403).json({
        status: "fail",
        message: isOTPVerified.message,
      });
    }

    const payload = {
      user_id: storedUserData.user_id,
      user_first_name: storedUserData.user_first_name,
      user_last_name: storedUserData.user_last_name,
      user_role: storedUserData.user_role,
      user_role_name: storedUserData.user_role_name,
      user_email: storedUserData.user_email,
      user_phone: storedUserData.user_phone,
    };
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: "27d",
      // token expires in 27 days
    });

    delete LoginUser[user_email];
    const result = await loginService.deleteOTP(user_email);

    res.status(200).json({
      status: "success",
      message: "Login success!",
      data: {
        access_token: token,
      },
    });
  } catch (error) {
    console.error(error);
    if (error.status && error.message) {
      return res.status(500).json({
        status: error.status,
        message: error.message,
        emailError: error.emailError,
      });
    } else {
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
}

async function resendOTP(req, res, next) {
  try {
    const { userEmail } = req.body;
    const userExist = await getUserByEmail(userEmail);

    if (!userExist) {
      return res.status(404).json({
        status: "fail",
        message:
          "User with this email does not exist. Please check and try again.",
      });
    }

    if (!LoginUser[userEmail]) {
      return res.status(404).json({
        status: "fail",
        message: "Session expired. Please login again to receive a new OTP.",
      });
    }
    const existingOTP = await getOTPByEmail(userEmail);

    if (existingOTP) {
      return res.status(200).json({
        status: "fail",
        message:
          "We’ve already sent an OTP to your email address. please check your email.",
      });
    }
    const newOTP = await loginService.generateAndSendOTP(
      userEmail,
      userExist.data[0]?.user_first_name
    );

    if (newOTP.status === "fail") {
      return res.status(500).json({
        status: "fail",
        message:
          "Failed to generate and send a new OTP, please try again later.",
      });
    }

    if (newOTP.otp) {
      const maskedEmail = maskEmail(userEmail);
      return res.status(200).json({
        status: "success",
        message: `A new OTP has been sent to your email ${maskedEmail}. it is valid for 5 minutes.`,
      });
    } else {
      return res.status(500).json({
        status: "fail",
        message: "Failed to generate and send a new OTP.",
      });
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  logIn,
  verifyOTPAndGenerateToken,
  resendOTP,
};
