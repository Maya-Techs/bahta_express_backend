const conn = require("../config/db.config");

async function getStats() {
  try {
    const [quoteRows] = await conn.query(
      "SELECT COUNT(*) AS total FROM quotes"
    );

    const [todayQuoteRows] = await conn.query(
      "SELECT COUNT(*) AS total FROM quotes WHERE DATE(submitted_at) = CURDATE()"
    );

    const [weekQuoteRows] = await conn.query(
      "SELECT COUNT(*) AS total FROM quotes WHERE YEARWEEK(submitted_at, 1) = YEARWEEK(CURDATE(), 1)"
    );

    // const [statusQuoteRows] = await conn.query(
    //   `SELECT status, COUNT(*) AS total FROM quotes GROUP BY status`
    // );
    const statusQuoteRows = await conn.query(
      `SELECT status, COUNT(*) AS total FROM quotes GROUP BY status`
    );

    // Initialize default counts
    const statusCounts = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    // Populate from query results
    for (const row of statusQuoteRows) {
      if (row.status && row.total !== undefined) {
        statusCounts[row.status] = row.total;
      }
    }

    const totalApproved = statusCounts.approved;
    const totalRejected = statusCounts.rejected;
    const totalPending = statusCounts.pending;

    // const totalApproved = statusCounts["approved"] || 0;
    // const totalRejected = statusCounts["rejected"] || 0;
    // const totalPending = statusCounts["pending"] || 0;

    const [blogRows] = await conn.query("SELECT COUNT(*) AS total FROM blogs");
    const [clientRows] = await conn.query(
      "SELECT COUNT(*) AS total FROM clients"
    );
    const [userRows] = await conn.query("SELECT COUNT(*) AS total FROM users");
    const [categoryRows] = await conn.query(
      "SELECT COUNT(*) AS total FROM categories"
    );
    const [tagRows] = await conn.query("SELECT COUNT(*) AS total FROM tags");

    const [serviceRows] = await conn.query(
      "SELECT COUNT(*) AS total FROM services"
    );

    return {
      total_quotes: quoteRows.total,
      total_quotes_today: todayQuoteRows.total,
      total_quotes_current_week: weekQuoteRows.total,
      total_approved_quotes: totalApproved,
      total_rejected_quotes: totalRejected,
      total_pending_quotes: totalPending,
      total_blogs: blogRows.total,
      total_clients: clientRows.total,
      total_users: userRows.total,
      total_categories: categoryRows.total,
      total_tags: tagRows.total,
      total_services: serviceRows.total,
    };
  } catch (error) {
    console.error("Error getting stats:", error);
    throw error;
  }
}

module.exports = {
  getStats,
};
