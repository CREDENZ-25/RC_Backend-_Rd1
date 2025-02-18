const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;

    if (!token) {
        return res.status(403).json({ message: "Please login." }); // Forbidden
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "unauthorized user" });
        }

        req.user = user;
        next();
    });
};

module.exports = authMiddleware;
