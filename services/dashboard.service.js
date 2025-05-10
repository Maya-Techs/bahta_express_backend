const conn = require("../config/db.config");

async function getStats() {
  try {
    const [portfolioRows] = await conn.query(
      "SELECT COUNT(*) AS total FROM portfolios"
    );
    const [blogRows] = await conn.query("SELECT COUNT(*) AS total FROM blogs");
    const [clientRows] = await conn.query(
      "SELECT COUNT(*) AS total FROM clients"
    );
    const [userRows] = await conn.query("SELECT COUNT(*) AS total FROM users");
    const [categoryRows] = await conn.query(
      "SELECT COUNT(*) AS total FROM categories"
    );
    const [tagRows] = await conn.query("SELECT COUNT(*) AS total FROM tags");

    return {
      total_portfolios: portfolioRows.total,
      total_blogs: blogRows.total,
      total_clients: clientRows.total,
      total_users: userRows.total,
      total_categories: categoryRows.total,
      total_tags: tagRows.total,
    };
  } catch (error) {
    console.error("Error getting stats:", error);
    throw error;
  }
}

module.exports = {
  getStats,
};
