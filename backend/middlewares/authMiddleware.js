import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    // Agar token nahi mila, toh 401 Unauthorized bhej do
    return res.status(401).send("You are not authenticated");
  }

  // FIX: process.env.JWT_SECRET ki jagah JWT_KEY use kiya (jo controller mein use ho raha hai)
  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      // Agar token invalid hai (expired, tampered), toh 403 Forbidden bhej do
      console.error("JWT Verification Error:", err);
      return res.status(403).send("Token is not valid or expired");
    }
    req.userId = payload.userId;
    next();
  });
};
