const express = require("express");
const router = express.Router();
const statsController = require("../controllers/dashboard.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get(
  "/dashboard/stats",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  statsController.getStats
);

module.exports = router;
