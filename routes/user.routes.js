const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

const authMiddleware = require("../middlewares/auth.middleware");

router.post(
  "/api/admin/user",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  userController.createUserAdmin
);

router.get(
  "/api/users",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  userController.getAllUsers
);
router.get(
  "/api/user-info",
  [authMiddleware.verifyToken, authMiddleware.IsAuthorized],
  userController.getUser
);
router.put(
  "/api/user/update/:id",
  [authMiddleware.verifyToken, authMiddleware.IsAuthorized],
  userController.updateUser
);

router.put(
  "/api/admin/user/:user_id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  userController.updateUserAdmin
);

router.delete(
  "/api/admin/user/:user_id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  userController.deleteUser
);

module.exports = router;
