const db = require("../config/db");

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC",
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users." });
  }
};

// Get all testers (for assignment dropdown)
const getTesters = async (req, res) => {
  try {
    const [testers] = await db.query(
      "SELECT id, name, email FROM users WHERE role = 'tester'",
    );
    res.json(testers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching testers." });
  }
};

// Dashboard analytics
const getAnalytics = async (req, res) => {
  try {
    const [[{ total }]] = await db.query(
      "SELECT COUNT(*) AS total FROM tickets",
    );
    const [[{ open }]] = await db.query(
      "SELECT COUNT(*) AS open FROM tickets WHERE status = 'open'",
    );
    const [[{ in_progress }]] = await db.query(
      "SELECT COUNT(*) AS in_progress FROM tickets WHERE status = 'in_progress'",
    );
    const [[{ resolved }]] = await db.query(
      "SELECT COUNT(*) AS resolved FROM tickets WHERE status = 'resolved'",
    );
    const [[{ closed }]] = await db.query(
      "SELECT COUNT(*) AS closed FROM tickets WHERE status = 'closed'",
    );
    const [[{ total_users }]] = await db.query(
      "SELECT COUNT(*) AS total_users FROM users",
    );

    res.json({ total, open, in_progress, resolved, closed, total_users });
  } catch (err) {
    res.status(500).json({ message: "Error fetching analytics." });
  }
};

module.exports = { getAllUsers, getTesters, getAnalytics };
