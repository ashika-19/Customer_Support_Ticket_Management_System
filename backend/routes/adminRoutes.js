const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/auth");
const {
  getAllUsers,
  getTesters,
  getAnalytics,
} = require("../controllers/adminController");

router.get("/users", verifyToken, requireRole("admin"), getAllUsers);
router.get("/testers", verifyToken, requireRole("admin"), getTesters);
router.get("/analytics", verifyToken, requireRole("admin"), getAnalytics);

module.exports = router;
