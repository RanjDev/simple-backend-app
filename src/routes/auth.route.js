import { Router } from "express";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import loginValidate from "../validations/login.validate.js";
import bcrypt from "bcryptjs";

const authRoutes = Router();

// Login
authRoutes.post("/login", async (req, res) => {
  try {
    await loginValidate.validateAsync(req.body);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  const { email, password } = req.body;
  const userEmail = await User.findOne({ email });
  if (userEmail) {
    const user = bcrypt.compareSync(password, userEmail.password);
    if (user) {
      const token = jwt.sign(
        JSON.stringify(userEmail),
        process.env.JWT_PRIVATE_KEY
      );
      return res.json(token);
    } else {
      return res.status(400).json({ error: "wrong email or password" });
    }
  }
  {
    return res.status(400).json({ error: "wrong email or password" });
  }
});

export default authRoutes;
