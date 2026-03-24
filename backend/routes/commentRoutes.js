const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { addComment } = require("../controllers/commentController");

router.post("/", verifyToken, addComment);

module.exports = router;
