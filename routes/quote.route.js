const express = require("express");
const router = express.Router();
const quoteController = require("../controllers/quote.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get(
  "/quotes",
  [authMiddleware.verifyToken, authMiddleware.IsAuthorized],
  quoteController.getAllQuotes
);

router.post("/quote", quoteController.createQuote);

router.put(
  "/quote/:quoteId/status",
  [authMiddleware.verifyToken, authMiddleware.IsAuthorized],
  quoteController.updateQuoteStatus
);

router.put(
  "/quote/:quoteId",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  quoteController.updateQuote
);

router.delete(
  "/quote/:quoteId",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  quoteController.deleteQuote
);

module.exports = router;
