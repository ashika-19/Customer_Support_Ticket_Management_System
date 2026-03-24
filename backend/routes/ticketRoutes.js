const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/auth");
const {
  createTicket,
  getMyTickets,
  getAssignedTickets,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  assignTicket,
  deleteTicket,
} = require("../controllers/ticketController");

// Customer routes
router.post("/", verifyToken, requireRole("customer"), createTicket);
router.get("/my", verifyToken, requireRole("customer"), getMyTickets);

// Tester routes
router.get("/assigned", verifyToken, requireRole("tester"), getAssignedTickets);
router.patch(
  "/:id/status",
  verifyToken,
  requireRole("tester", "admin"),
  updateTicketStatus,
);

// Admin routes
router.get("/all", verifyToken, requireRole("admin"), getAllTickets);
router.patch("/:id/assign", verifyToken, requireRole("admin"), assignTicket);
router.delete("/:id", verifyToken, requireRole("admin"), deleteTicket);

// Shared (any logged-in user can view a ticket they're part of)
router.get("/:id", verifyToken, getTicketById);

module.exports = router;
