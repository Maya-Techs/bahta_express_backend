const conn = require("../config/db.config");

async function checkIfCategoryExistsByName(category_name) {
  const query = "SELECT * FROM categories WHERE category_name = ? ";
  const rows = await conn.query(query, [category_name]);
  if (rows.length > 0) {
    return true;
  }
  return false;
}
async function checkIfCategoryExistsByID(category_id) {
  const query = "SELECT * FROM categories WHERE category_id = ? ";
  const rows = await conn.query(query, [category_id]);
  if (rows.length > 0) {
    return true;
  }
  return false;
}

async function createCategory(category) {
  let createdCategory = {};
  try {
    const query =
      "INSERT INTO categories (category_name, description) VALUES (?, ?)";
    const rows = await conn.query(query, [
      category.category_name,
      category.description,
    ]);
    if (rows.affectedRows !== 1) {
      return false;
    }

    const category_id = rows.insertId;
    createdCategory = {
      category_id: category_id,
    };
  } catch (err) {
    console.error(err);
  }
  return createdCategory;
}

async function getAllCategories() {
  try {
    const query = "SELECT * FROM categories";
    const rows = await conn.query(query);
    return rows;
  } catch (error) {
    console.error("Error getting all categories:", error);
    throw error;
  }
}

async function deleteCategory(categoryId) {
  try {
    await conn.query("DELETE FROM categories WHERE category_id = ?", [
      categoryId,
    ]);

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateCategory(categoryId, updatedCategoryData) {
  try {
    const updateQuery =
      "UPDATE categories SET category_name = ?, description = ? WHERE category_id = ?";
    await conn.query(updateQuery, [
      updatedCategoryData.category_name,
      updatedCategoryData.description,
      categoryId,
    ]);

    const updateInfoQuery =
      "UPDATE categories SET category_name = ?, description = ? WHERE category_id = ?";
    await conn.query(updateInfoQuery, [
      updatedCategoryData.category_name,
      updatedCategoryData.description,
      categoryId,
    ]);
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  checkIfCategoryExistsByName,
  checkIfCategoryExistsByID,
  createCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
};
