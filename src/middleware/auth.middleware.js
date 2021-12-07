import jwt from "jsonwebtoken";

// middleware to check if the user is logged in
export function isLoggedIn(req, res, next) {
  const token = req.headers.authorization;
  try {
    const decode = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
  next();
}

//middleware to check if the user is admin and has admin privileges
export function isAdmin(req, res, next) {
  let token = req.headers.authorization;

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
