import jwt from "jsonwebtoken";

export const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token)
    return res.status(401).json({ message: "Auth required" });

  try {
    req.user = jwt.verify(token, "secret_ecom").user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
