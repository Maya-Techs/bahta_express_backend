const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categories.controller");

const authMiddleware = require("../middlewares/auth.middleware");
// {******************* Admin Routes ******************}
router.post(
  "/category",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  categoryController.createCategory
);

router.delete(
  "/category/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  categoryController.deleteCategory
);

router.put(
  "/category/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  categoryController.updateCategory
);

// {******************* Public Routes ******************}
router.get("/categories", categoryController.getAllCategories);
module.exports = router;
