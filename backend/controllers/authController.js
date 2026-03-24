const db = require("../config/db");
const jwt = require("jsonwebtoken");

// REGISTER
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const allowedRoles = ["customer", "tester"];
  const userRole = allowedRoles.includes(role) ? role : "customer";

  try {
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already registered." });
    }

    // ✅ Store plain text password directly
    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, password, userRole],
    );

    res.status(201).json({ message: "Registration successful! Please login." });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = users[0];

    // ✅ Simple plain text comparison
    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

module.exports = { register, login };
