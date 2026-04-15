const express = require("express");
const router = express.Router();
const {
  requestPasswordReset,
  resetPassword,
  changePassword,
} = require("../controllers/password_reset.controller");
const authMiddleware = require("../middlewares/auth.middleware");
router.post("/api/request-password-reset", requestPasswordReset);
router.post("/api/reset-password", resetPassword);
router.post(
  "/api/change-password",
  [authMiddleware.verifyToken, authMiddleware.IsAuthorized],
  changePassword
);
module.exports = router;
