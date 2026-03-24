const db = require("../config/db");

// Customer: Create a new ticket
const createTicket = async (req, res) => {
  const { title, description, priority } = req.body;
  const customerId = req.user.id;

  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Title and description are required." });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO tickets (title, description, priority, customer_id) VALUES (?, ?, ?, ?)",
      [title, description, priority || "medium", customerId],
    );
    res
      .status(201)
      .json({ message: "Ticket created!", ticketId: result.insertId });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating ticket.", error: err.message });
  }
};

// Customer: Get their own tickets
const getMyTickets = async (req, res) => {
  try {
    const [tickets] = await db.query(
      `SELECT t.*, u.name AS assigned_to_name 
       FROM tickets t 
       LEFT JOIN users u ON t.assigned_to = u.id
       WHERE t.customer_id = ?
       ORDER BY t.created_at DESC`,
      [req.user.id],
    );
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tickets." });
  }
};

// Tester: Get tickets assigned to them
const getAssignedTickets = async (req, res) => {
  const { status } = req.query; // Optional filter by status
  try {
    let query = `
      SELECT t.*, u.name AS customer_name 
      FROM tickets t
      JOIN users u ON t.customer_id = u.id
      WHERE t.assigned_to = ?
    `;
    const params = [req.user.id];

    if (status) {
      query += " AND t.status = ?";
      params.push(status);
    }
    query += " ORDER BY t.created_at DESC";

    const [tickets] = await db.query(query, params);
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tickets." });
  }
};

// Admin: Get ALL tickets
const getAllTickets = async (req, res) => {
  try {
    const [tickets] = await db.query(
      `SELECT t.*, 
              c.name AS customer_name, 
              a.name AS assigned_to_name
       FROM tickets t
       JOIN users c ON t.customer_id = c.id
       LEFT JOIN users a ON t.assigned_to = a.id
       ORDER BY t.created_at DESC`,
    );
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tickets." });
  }
};

// Get a single ticket by ID (with comments)
const getTicketById = async (req, res) => {
  const { id } = req.params;
  try {
    const [tickets] = await db.query(
      `SELECT t.*, c.name AS customer_name, a.name AS assigned_to_name
       FROM tickets t
       JOIN users c ON t.customer_id = c.id
       LEFT JOIN users a ON t.assigned_to = a.id
       WHERE t.id = ?`,
      [id],
    );

    if (tickets.length === 0)
      return res.status(404).json({ message: "Ticket not found." });

    const ticket = tickets[0];

    // Fetch comments for this ticket
    const [comments] = await db.query(
      `SELECT cm.*, u.name AS author_name, u.role AS author_role
       FROM comments cm
       JOIN users u ON cm.user_id = u.id
       WHERE cm.ticket_id = ?
       ORDER BY cm.created_at ASC`,
      [id],
    );

    res.json({ ...ticket, comments });
  } catch (err) {
    res.status(500).json({ message: "Error fetching ticket." });
  }
};

// Tester: Update ticket status
const updateTicketStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const validStatuses = ["open", "in_progress", "resolved", "closed"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  try {
    await db.query("UPDATE tickets SET status = ? WHERE id = ?", [status, id]);
    res.json({ message: "Ticket status updated." });
  } catch (err) {
    res.status(500).json({ message: "Error updating status." });
  }
};

// Admin: Assign ticket to a tester
const assignTicket = async (req, res) => {
  const { id } = req.params;
  const { testerId } = req.body;

  try {
    await db.query(
      'UPDATE tickets SET assigned_to = ?, status = "in_progress" WHERE id = ?',
      [testerId, id],
    );
    res.json({ message: "Ticket assigned successfully." });
  } catch (err) {
    res.status(500).json({ message: "Error assigning ticket." });
  }
};

// Admin: Delete a ticket
const deleteTicket = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM tickets WHERE id = ?", [id]);
    res.json({ message: "Ticket deleted." });
  } catch (err) {
    res.status(500).json({ message: "Error deleting ticket." });
  }
};

module.exports = {
  createTicket,
  getMyTickets,
  getAssignedTickets,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  assignTicket,
  deleteTicket,
};
