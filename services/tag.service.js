const conn = require("../config/db.config");

async function checkIfTagExistsByName(tag_name) {
  const query = "SELECT * FROM tags WHERE tag_name = ? ";
  const rows = await conn.query(query, [tag_name]);
  if (rows.length > 0) {
    return true;
  }
  return false;
}
async function checkIfTagExistsByID(tag_id) {
  const query = "SELECT * FROM tags WHERE tag_id = ? ";
  const rows = await conn.query(query, [tag_id]);
  if (rows.length > 0) {
    return true;
  }
  return false;
}

async function createTag(tag) {
  let createdTag = {};
  try {
    const query = "INSERT INTO tags (tag_name, description) VALUES (?, ?)";
    const rows = await conn.query(query, [tag.tag_name, tag.description]);
    if (rows.affectedRows !== 1) {
      return false;
    }

    const tag_id = rows.insertId;
    createdTag = {
      tag_id: tag_id,
    };
  } catch (err) {
    console.error(err);
  }
  return createdTag;
}

async function getAllTags() {
  try {
    const query = "SELECT * FROM tags";
    const rows = await conn.query(query);
    return rows;
  } catch (error) {
    console.error("Error getting all tags:", error);
    throw error;
  }
}

async function deleteTag(tagId) {
  try {
    await conn.query("DELETE FROM tags WHERE tag_id = ?", [tagId]);

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateTag(tagId, updatedTagData) {
  try {
    const updateQuery =
      "UPDATE tags SET tag_name = ?, description = ? WHERE tag_id = ?";
    await conn.query(updateQuery, [
      updatedTagData.tag_name,
      updatedTagData.description,
      tagId,
    ]);

    const updateInfoQuery =
      "UPDATE tags SET tag_name = ?, description = ? WHERE tag_id = ?";
    await conn.query(updateInfoQuery, [
      updatedTagData.tag_name,
      updatedTagData.description,
      tagId,
    ]);
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  checkIfTagExistsByName,
  checkIfTagExistsByID,
  createTag,
  getAllTags,
  deleteTag,
  updateTag,
};
