const postService = require("../services/blog.service");
const fs = require("fs");
const path = require("path");
const upload = require("../middlewares/upload.middleware");
const { v4: uuidv4 } = require("uuid");

async function createBlog(req, res, next) {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: err });
    }
    try {
      const { author_id, status, title, content, slug, category_id, tag_ids } =
        req.body;
      const imagePath = req.files["blog_image"]
        ? req.files["blog_image"][0].filename
        : null;
      if (
        !author_id ||
        !status ||
        !title ||
        !content ||
        !category_id ||
        !tag_ids ||
        !imagePath
      ) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const blogData = {
        author_id,
        status,
        title,
        content,
        slug,
        category_id,
        tag_ids,
        image_url: imagePath,
        post_id: uuidv4(),
      };

      const blog = await postService.createBlog(blogData);

      if (!blog) {
        return res.status(400).json({ error: "Failed to create blog" });
      }

      res
        .status(200)
        .json({ status: true, message: "Blog Created Successfully" });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Something went wrong" });
    }
  });
}
async function updateBlog(req, res, next) {
  try {
    const postId = req.params.post_id;
    upload(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ error: err });
      }

      const { blog_id, status, title, content, slug, category_id, tag_ids } =
        req.body;
      if (
        !blog_id ||
        !status ||
        !title ||
        !content ||
        !category_id ||
        !tag_ids
      ) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const imagePath = req.files["blog_image"]
        ? req.files["blog_image"][0].filename
        : null;

      const blogData = {
        blog_id,
        status,
        title,
        content,
        slug,
        category_id,
        tag_ids,
        image_url: imagePath,
      };

      const blog = await postService.updatePost(postId, blogData);

      if (!blog) {
        return res.status(400).json({ error: "Failed to update blog" });
      }

      res
        .status(200)
        .json({ status: true, message: "Blog Update Successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Something went wrong" });
  }
}
async function getAllAdminPosts(req, res, next) {
  try {
    const posts = await postService.getAllAdminPosts();
    if (!posts) {
      return res.status(400).json({
        error: "Failed to get all posts",
      });
    }

    return res.status(200).json({
      status: true,
      data: posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
async function getAllPublicBlogs(req, res, next) {
  try {
    const posts = await postService.getAllPublicBlogs();
    if (!posts) {
      return res.status(400).json({
        error: "Failed to get all posts",
      });
    }
    return res.status(200).json({
      status: true,
      data: posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
async function getPublicBlogs(req, res, next) {
  try {
    const posts = await postService.getPublicBlogs();

    if (!posts) {
      return res.status(400).json({
        error: "Failed to get public posts posts",
      });
    }
    return res.status(200).json({
      status: true,
      data: posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
async function getBlogEditInitial(req, res, next) {
  const postId = req.params.post_id;
  try {
    if (!postId) {
      return res.status(400).json({
        error: "Post ID is required",
      });
    }
    const posts = await postService.getBlogEditInitial(postId);
    if (!posts) {
      return res.status(400).json({
        error: "Failed to get initial blog data",
      });
    }
    return res.status(200).json({
      status: true,
      data: posts[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
async function getBlogDetail(req, res, next) {
  const postId = req.params.postId;
  try {
    if (!postId) {
      return res.status(400).json({
        error: "Post ID is required",
      });
    }

    const isBlogExist = await postService.checkIfBlogExistsByPostID(postId);

    if (!isBlogExist) {
      return res.status(404).json({
        error: "Blog not found",
      });
    }

    const posts = await postService.getBlogDetail(postId);
    if (!posts) {
      return res.status(400).json({
        error: "Failed to get blog detail",
      });
    }
    return res.status(200).json({
      status: true,
      data: posts[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
async function getRelatedBlogs(req, res, next) {
  try {
    const { post_id } = req.body;
    if (!post_id) {
      return res.status(400).json({ error: "post_id is required" });
    }
    const data = await postService.getBlogDetail(post_id);

    const posts = await postService.getRelatedBlogs(
      post_id,
      data[0].category_id
    );

    if (!posts) {
      return res.status(400).json({
        error: "Failed to get related blogs",
      });
    }
    return res.status(200).json({
      status: true,
      data: posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
async function deleteBlog(req, res, next) {
  const blogID = req.params.blogId;
  try {
    await deleteBlogImage(blogID);
    const result = await postService.deletePost(blogID);
    if (result) {
      res.status(200).json({
        status: true,
        message: "Blog deleted successfully!",
      });
    } else {
      res.status(404).json({
        error: "Blog not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
async function deleteBlogImage(blogID) {
  try {
    const imgPaths = await postService.getBlogImagePaths(blogID);

    if (!imgPaths) {
      console.error(`No image found for blog with ID ${blogID}`);
      return;
    }
    if (imgPaths) {
      deleteFile(imgPaths.image_url);
    }
  } catch (error) {
    console.error("Error deleting imgs:", error);
  }
}
function deleteFile(filePath) {
  return new Promise((resolve, reject) => {
    const absolutePath = path.join(
      __dirname,
      "../public/uploads/images/blog",
      filePath
    );
    fs.access(absolutePath, fs.constants.F_OK, (err) => {
      if (err) {
        if (err.code === "ENOENT") {
          resolve();
        } else {
          reject(err);
        }
      } else {
        fs.unlink(absolutePath, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  });
}
module.exports = {
  createBlog,
  getAllAdminPosts,
  updateBlog,
  getBlogEditInitial,
  deleteBlog,
  getBlogDetail,
  getRelatedBlogs,
  getPublicBlogs,
  getAllPublicBlogs,
};
