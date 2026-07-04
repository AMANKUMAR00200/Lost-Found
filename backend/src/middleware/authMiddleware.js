const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Debug
    console.log("Authorization Header:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Access denied - No Authorization header",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied - Invalid Authorization format",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("Token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token:", decoded);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || "student",
    };

    next();
  } catch (error) {
    console.log("JWT Error:", error);

    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = authMiddleware;