const statsService = require("../services/dashboard.service");

async function getStats(req, res) {
  try {
    const stats = await statsService.getStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving statistics", error });
  }
}

module.exports = {
  getStats,
};
