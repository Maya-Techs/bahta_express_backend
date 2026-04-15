const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post(
  "/service",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  serviceController.createService
);

router.get(
  "/service/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  serviceController.getServiceById
);

router.put(
  "/service/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  serviceController.updateService
);

router.delete(
  "/service/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  serviceController.deleteService
);
router.get("/pub/services", serviceController.getAllServices);

module.exports = router;
