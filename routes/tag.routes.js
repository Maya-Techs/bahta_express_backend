const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tag.controller");

const authMiddleware = require("../middlewares/auth.middleware");
// {******************* Admin Routes ******************}
router.post(
  "/tag",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  tagController.createTag
);

router.delete(
  "/tag/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  tagController.deleteTag
);

router.put(
  "/tag/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  tagController.updateTag
);

// {******************* Public Routes ******************}
router.get("/tags", tagController.getAllTags);

module.exports = router;
