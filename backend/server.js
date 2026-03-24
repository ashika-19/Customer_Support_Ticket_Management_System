const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tickets", require("./routes/ticketRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Health check
app.get("/", (req, res) =>
  res.json({ message: "Support Ticket API is running!" }),
);

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Route not found." }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
