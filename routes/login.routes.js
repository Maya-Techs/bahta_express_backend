const express = require("express");
const router = express.Router();
const loginControllers = require("../controllers/login.controller");

router.post("/api/login", loginControllers.logIn);

router.post("/api/verify-otp", loginControllers.verifyOTPAndGenerateToken);

router.post("/api/resend-otp", loginControllers.resendOTP);

module.exports = router;
