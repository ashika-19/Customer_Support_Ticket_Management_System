const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Token comes in the header: Authorization: Bearer <token>
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next(); // Continue to the actual route handler
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

// Role-based guard: only allow specific roles
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access forbidden: insufficient role." });
    }
    next();
  };
};

module.exports = { verifyToken, requireRole };
