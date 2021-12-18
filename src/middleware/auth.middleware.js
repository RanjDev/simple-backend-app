import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config("dotenv");
// middleware to check if the user is logged in
export function isLoggedIn(req, res, next) {
  // const token = req.headers.authorization.replace("Bearer ", "");
  let token = req.headers.authorization;

  if (token === undefined || token === "") {
    return res.status(400).json({ error: "Not Authenticated" });
  }

  token = token.replace(/^Bearer\s+/, "");

  try {
    const decode = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
  } catch (error) {
    return res.status(400).json({ error: "Not Authenticated" });
  }
  next();
}

//middleware to check if the user is admin and has admin privileges
export function isAdmin(req, res, next) {
  let token = req.headers.authorization;
  if (token === undefined || token === "") {
    return res.status(400).json({ error: "Not Authenticated" });
  }

  token = token.replace(/^Bearer\s+/, "");
  try {
    const user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    if (user.role === "admin") {
      req.user = user;
      return next();
    }
    return res.status(401).json({ error: "Not Authorized" });
  } catch (err) {
    return res.status(401).json({ error: "Not Authorized" });
  }
}
