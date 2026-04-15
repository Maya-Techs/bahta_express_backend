const db = require("../config/db.config");

async function checkIfBlogExistsByPostID(postId) {
  const query = "SELECT * FROM blogs WHERE post_id = ?";
  const rows = await db.query(query, [postId]);

  return rows.length > 0;
}
async function createBlog(postData) {
  try {
    const {
      author_id,
      status,
      title,
      content,
      slug,
      category_id,
      tag_ids,
      image_url,
      post_id,
    } = postData;

    const query = `
      INSERT INTO blogs (post_id, author_id, title, slug, status, content, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await db.query(query, [
      post_id,
      author_id,
      title,
      slug,
      status,
      content,
      image_url,
    ]);

    if (result.affectedRows === 0) return null;

    const blogId = result.insertId;

    if (Array.isArray(tag_ids) && tag_ids.length > 0) {
      const tagValues = tag_ids.map((tagId) => [blogId, tagId]);
      const placeholders = tagValues.map(() => "(?, ?)").join(", ");
      const flatValues = tagValues.flat();

      const query2 = `INSERT INTO blog_tags (blog_id, tag_id) VALUES ${placeholders}`;
      await db.query(query2, flatValues);
    }

    const query3 = `INSERT INTO blog_categories (blog_id, category_id) VALUES (?, ?)`;
    await db.query(query3, [blogId, category_id]);

    return {
      post_id: blogId,
      author_id,
      title,
      content,
      image_url,
    };
  } catch (error) {
    console.error(error);
  }
}
async function createComment(postId, commentData) {
  try {
    const { user_id, comment_text } = commentData;
    const query = `
      INSERT INTO comments (post_id, user_id, comment_text)
      VALUES (?, ?, ?)
    `;
    const result = await db.query(query, [postId, user_id, comment_text]);
    if (result.affectedRows > 0) {
      return {
        comment_id: result.insertId,
        post_id: postId,
        user_id,
        comment_text,
      };
    }
    return null;
  } catch (error) {
    throw new Error("Error creating comment: " + error.message);
  }
}
async function getBlogImagePaths(blogId) {
  try {
    const query = `
      SELECT image_url FROM blogs WHERE blog_id = ?`;
    const rows = await db.query(query, [blogId]);

    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (error) {
    console.error("Error getting blog image by ID:", error);
    throw error;
  }
}
async function getAllAdminPosts() {
  try {
    const query = `SELECT 
      b.blog_id,
      b.image_url,
      CONCAT(bai.user_first_name, ' ', bai.user_last_name) AS author_name,
      b.created_at,
      b.post_id,
      b.title,
      SUBSTRING(b.content, 1, 100) AS excerpt
    FROM blogs b
    INNER JOIN users_info bai ON b.author_id = bai.user_id
    ORDER BY b.blog_id DESC;`;

    const rows = await db.query(query);
    return rows;
  } catch (error) {
    console.error("Error getting all Blogs:", error);
    throw error;
  }
}

async function getAllPublicBlogs() {
  try {
    const query = `SELECT 
      b.blog_id,
      b.image_url,
      CONCAT(bai.user_first_name, ' ', bai.user_last_name) AS author_name,
      b.created_at,
      b.post_id,
      b.title,
      SUBSTRING(b.content, 1, 100) AS excerpt
    FROM blogs b
    INNER JOIN users_info bai ON b.author_id = bai.user_id
    WHERE b.status = 'Published'
    ORDER BY b.blog_id DESC;`;

    const rows = await db.query(query);

    return rows;
  } catch (error) {
    console.error("Error getting all Blogs:", error);
    throw error;
  }
}

async function getPublicBlogs() {
  try {
    const query = `SELECT 
      b.blog_id,
      b.image_url,
      CONCAT(bai.user_first_name, ' ', bai.user_last_name) AS author_name,
      b.created_at,
      b.post_id,
      b.title,
      SUBSTRING(b.content, 1, 100) AS excerpt
    FROM blogs b
    INNER JOIN users_info bai ON b.author_id = bai.user_id
    WHERE b.status = 'Published'
    ORDER BY b.blog_id DESC
    LIMIT 6;`;

    const rows = await db.query(query);

    return rows;
  } catch (error) {
    console.error("Error getting latest published blogs:", error);
    throw error;
  }
}

async function getBlogEditInitial(postID) {
  try {
    const query = `SELECT 
  b.*, 
  blogCate.category_id
FROM blogs b
INNER JOIN users_info bai ON b.author_id = bai.user_id
LEFT JOIN blog_categories blogCate ON blogCate.blog_id = b.blog_id WHERE b.post_id = ?
ORDER BY b.blog_id DESC;`;
    const rows = await db.query(query, [postID]);
    const blogs = await Promise.all(
      rows.map(async (blog) => {
        try {
          const tagIDs = await db.query(
            "SELECT tag_id FROM blog_tags WHERE blog_id = ?",
            [blog.blog_id]
          );
          const tag_ids = tagIDs.map((tag) => Number(tag.tag_id));

          const allBlogs = {
            ...blog,
            tag_ids,
          };
          return allBlogs;
        } catch (error) {
          console.error("Error fetching image for blog:", error);
          return blog;
        }
      })
    );

    return blogs;
  } catch (error) {
    console.error("Error getting Blogs Edit initial data:", error);
    throw error;
  }
}
async function getBlogDetail(postID) {
  try {
    const query = `SELECT 
  b.*, 
  CONCAT(bai.user_first_name, ' ', bai.user_last_name) AS author_name, 
  blogCate.category_id, 
  cats.category_name
FROM blogs b
INNER JOIN users_info bai ON b.author_id = bai.user_id
LEFT JOIN blog_categories blogCate ON blogCate.blog_id = b.blog_id
LEFT JOIN categories cats ON blogCate.category_id = cats.category_id
WHERE b.post_id = ? AND status = 'Published'
ORDER BY b.blog_id DESC;
    `;

    const rows = await db.query(query, [postID]);

    const blogs = await Promise.all(
      rows.map(async (blog) => {
        try {
          const tags = await db.query(
            `SELECT t.tag_name 
            FROM tags t
            INNER JOIN blog_tags bt ON bt.tag_id = t.tag_id
            WHERE bt.blog_id = ?`,
            [blog.blog_id]
          );
          const allBlogs = {
            ...blog,
            tags: tags.map((tag) => tag.tag_name),
          };

          return allBlogs;
        } catch (error) {
          console.error("Error fetching image for blog:", error);
          return blog;
        }
      })
    );

    return blogs;
  } catch (error) {
    console.error("Error getting blog detail data:", error);
    throw error;
  }
}
async function getRelatedBlogs(postID) {
  try {
    const query = `SELECT 
      b.blog_id,
      b.image_url,
      CONCAT(bai.user_first_name, ' ', bai.user_last_name) AS author_name,
      b.created_at,
      b.post_id,
      b.title
    FROM blogs b
    INNER JOIN users_info bai ON b.author_id = bai.user_id
    WHERE b.blog_id != ?
      AND b.status = 'Published'
    ORDER BY b.blog_id DESC;`;

    const blogs = await db.query(query, [postID]);

    if (!blogs.length) return [];

    return blogs;
  } catch (error) {
    console.error("Error getting related blogs:", error);
    throw error;
  }
}

async function checkIfPostExistsByID(postId) {
  try {
    const query = `SELECT 1 FROM posts WHERE post_id = ?`;
    const result = await db.query(query, [postId]);
    return result.length > 0;
  } catch (error) {
    throw new Error("Error checking post existence: " + error.message);
  }
}
async function deletePost(postId) {
  try {
    const query = `DELETE FROM blogs WHERE blog_id = ?`;
    const result = await db.query(query, [postId]);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error("Error deleting post: " + error.message);
  }
}
async function updatePost(postId, postData) {
  try {
    const {
      blog_id,
      status,
      title,
      content,
      slug,
      category_id,
      tag_ids,
      image_url,
    } = postData;

    let updateQuery = `
      UPDATE blogs
      SET title = ?, slug = ?, status = ?, content = ? 
    `;

    if (image_url !== null) {
      updateQuery += ", image_url = ?";
    }

    updateQuery += " WHERE post_id = ?";

    const queryParams = [
      title,
      slug,
      status,
      content,
      ...(image_url !== null ? [image_url] : []),
      postId,
    ];

    const result = await db.query(updateQuery, queryParams);

    const deleteCategoryQuery = `
      DELETE FROM blog_categories WHERE blog_id = ?
    `;
    await db.query(deleteCategoryQuery, [blog_id]);

    if (category_id) {
      const query3 = `INSERT INTO blog_categories (blog_id, category_id) VALUES (?, ?)`;
      await db.query(query3, [blog_id, category_id]);
    }

    const deleteTagsQuery = `
      DELETE FROM blog_tags WHERE blog_id = ?
    `;
    await db.query(deleteTagsQuery, [blog_id]);

    if (Array.isArray(tag_ids) && tag_ids.length > 0) {
      const tagValues = tag_ids.map((tagId) => [blog_id, Number(tagId)]);
      const placeholders = tagValues.map(() => "(?, ?)").join(", ");
      const flatValues = tagValues.flat();

      const query2 = `INSERT INTO blog_tags (blog_id, tag_id) VALUES ${placeholders}`;
      await db.query(query2, flatValues);
    }

    return true;
  } catch (error) {
    console.error(error);
  }
}
module.exports = {
  createBlog,
  createComment,
  checkIfPostExistsByID,
  deletePost,
  updatePost,
  getAllAdminPosts,
  getBlogEditInitial,
  getBlogImagePaths,
  getBlogDetail,
  getRelatedBlogs,
  checkIfBlogExistsByPostID,
  getPublicBlogs,
  getAllPublicBlogs,
};
