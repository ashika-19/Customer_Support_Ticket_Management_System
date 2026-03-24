const db = require("../config/db");

const addComment = async (req, res) => {
  const { ticket_id, message } = req.body;
  const userId = req.user.id;

  if (!message || !ticket_id) {
    return res
      .status(400)
      .json({ message: "Message and ticket_id are required." });
  }

  try {
    await db.query(
      "INSERT INTO comments (ticket_id, user_id, message) VALUES (?, ?, ?)",
      [ticket_id, userId, message],
    );
    res.status(201).json({ message: "Reply added!" });
  } catch (err) {
    res.status(500).json({ message: "Error adding comment." });
  }
};

module.exports = { addComment };
