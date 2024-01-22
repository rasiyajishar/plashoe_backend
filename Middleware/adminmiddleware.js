const jwt = require("jsonwebtoken");

const adminVerifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization;
  console.log(token);

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const verified = jwt.verify(token, "your-secret-key");
    req.verified = verified;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: "Invalid token" });
  }
};
module.exports = adminVerifyToken;
