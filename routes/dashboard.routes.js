const express = require("express");
const router = express.Router();
const statsController = require("../controllers/dashboard.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get(
  "/dashboard/stats",
  [authMiddleware.verifyToken, authMiddleware.IsAuthorized],
  statsController.getStats
);

module.exports = router;
