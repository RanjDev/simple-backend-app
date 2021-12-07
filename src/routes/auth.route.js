import { Router } from "express";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import loginValidate from "../validations/login.validate.js";

const authRoutes = Router();

// Login
authRoutes.post("/login", async (req, res) => {
  try {
    await loginValidate.validateAsync(req.body);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (user) {
    const token = jwt.sign(JSON.stringify(user), process.env.JWT_PRIVATE_KEY);
    res.json(token);
  } else {
    return res.status(400).json({ error: "wrong email or password" });
  }
});

export default authRoutes;
