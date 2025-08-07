const jwt = require("jsonwebtoken");

const authenticator = {
  // Middleware: check if route is public or needs JWT
  authenticateToken: async function (req, res, next, route_For) {
    if (this.isPublicRoute(req.path)) {
      return next(); // Skip auth for public routes
    }

    const result = await this.validateJWTToken(req, res, route_For);
    if (result === true) {
      return next(); // Token valid, go ahead
    }
    return result; // Return error response
  },

  // Validate JWT and check role
  validateJWTToken: async function (req, res, route_For) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access token required" });
    }

    const token = authHeader.substring(7); // Remove "Bearer "

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded.uid) {
        return res.status(401).json({ message: "Invalid token payload" });
      }

      // 🔐 Role-based check
      if (route_For && decoded.role !== route_For) {
        return res.status(403).json({ message: `Forbidden: ${route_For} access only` });
      }

      // Attach user info to request
      req.user = decoded;
      req.userId = decoded.uid;
      req.userRole = decoded.role || "user";

      return true;
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  },

  // List of routes that don't need auth
  isPublicRoute: function (path) {
    const publicRoutes = [
      "/login",
      "/register",
      // Add more if needed
    ];
    return publicRoutes.includes(path);
  }
};

module.exports = { authenticator };
