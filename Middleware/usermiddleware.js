const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const verified = jwt.verify(token, "secret-key");
    req.user = verified;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: "Invalid token" });
  }
};
module.exports = verifyToken;