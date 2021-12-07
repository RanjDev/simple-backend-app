import { Router } from "express";
import { isAdmin, isLoggedIn } from "../middleware/auth.middleware.js";
import User from "../models/user.model.js";
import userValidate from "../validations/user.validate.js";

const usersRoutes = Router();

// User routes
usersRoutes.get("/users", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    return res.json({ error: "Could not get the data " });
  }
});

usersRoutes.post("/users", async (req, res) => {
  try {
    await userValidate.validateAsync(req.body);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
  const newUser = new User(req.body);
  await newUser.save();
  res.json({ message: "New User Added" });
});

usersRoutes.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  let user;
  try {
    user = await User.findById(id);
  } catch (err) {
    return res.status(500).json({ error: "Unkown error" });
  }
  res.json(user);
});

usersRoutes.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndRemove(id);
  } catch (err) {
    return res.json({ error: "Unkown error" });
  }
  res.send(`User deleted`);
});

usersRoutes.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await userValidate.validateAsync(req.body);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
  await User.findByIdAndUpdate(id, req.body);
  res.json({ message: "Data updated" });
});

export default usersRoutes;
