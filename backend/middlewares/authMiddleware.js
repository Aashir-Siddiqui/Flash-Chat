import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).send("You are not authenticated");
  }

  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.status(403).send("Token is not valid or expired");
    }
    req.userId = payload.userId;
    next();
  });
};
