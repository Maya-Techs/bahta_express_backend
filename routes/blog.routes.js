const express = require("express");
const router = express.Router();
const postController = require("../controllers/blog.controller");

const authMiddleware = require("../middlewares/auth.middleware");
//  {******************** Admin Blog Routes *****************************}
// Create a new post
router.post(
  "/blog",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  postController.createBlog
);

// Get all posts
router.get(
  "/admin/blogs",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  postController.getAllAdminPosts
);

// Update a blog by ID
router.put(
  "/blog/:post_id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  postController.updateBlog
);
// 20000

// Delete a blog by ID
router.delete(
  "/api/blog/:blogId",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  postController.deleteBlog
);
// Edit data for blog edit initial
router.get(
  "/blog/edit/data/:post_id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  postController.getBlogEditInitial
);

//  {************************ Public Blog Routes ********************************}
// pub blogs
router.get("/pub/blogs", postController.getPublicBlogs);
// all pub blogs
router.get("/pub/all-blogs", postController.getAllPublicBlogs);
// Get blog details
router.get("/blog/details/:postId", postController.getBlogDetail);
// Get related blogs
router.post("/blog/related", postController.getRelatedBlogs);

module.exports = router;
