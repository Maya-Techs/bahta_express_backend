const express = require("express");
const router = express.Router();
const clientController = require("../controllers/client.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get(
  "/clients",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  clientController.getAllClients
);
router.post(
  "/client",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  clientController.createClient
);
router.get(
  "/client/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  clientController.getClientById
);
router.post(
  "/client/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  clientController.updateClient
);
router.delete(
  "/client/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  clientController.deleteClient
);

router.get("/pub/clients", clientController.getAllPubClients);

router.get("/pub/clients/testimonials", clientController.getWhatClientsSay);

module.exports = router;
