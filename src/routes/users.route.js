import { Router } from "express";
import winston from "winston";
import { isAdmin, isLoggedIn } from "../middleware/auth.middleware.js";
import User from "../models/user.model.js";
import userValidate from "../validations/user.validate.js";
import bcrypt from "bcryptjs";

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

usersRoutes.post("/users", isLoggedIn, isAdmin, async (req, res) => {
  try {
    await userValidate.validateAsync(req.body);
  } catch (err) {
    winston.error(`could not add user, error: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }

  let userEmail = await User.findOne({ email: req.body.email });

  if (userEmail) {
    return res
      .status(400)
      .json({ error: "This email already exists, try a new email" });
  }
  const newUser = new User(req.body);

  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(req.body.password, salt);

  newUser.password = hash;
  await newUser.save();

  winston.info("user added");
  res.json({ message: "New User Added" });
});

// here logedIn users can see other users
usersRoutes.get("/users/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  let user;
  try {
    user = await User.findById(id);
  } catch (err) {
    return res.status(500).json({ error: "Unkown error" });
  }
  res.json(user);
});

usersRoutes.delete("/users/:id", isLoggedIn, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndRemove(id);
  } catch (err) {
    winston.error("could not delete user");
    return res.json({ error: "Unkown error" });
  }
  winston.info("user deleted");
  res.send(`User deleted`);
});

usersRoutes.put("/users/:id", isLoggedIn, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await userValidate.validateAsync(req.body);
  } catch (err) {
    winston.error(`could not update user, error: ${err.message}`);
    return res.status(400).json({ error: err.message });
  }
  await User.findByIdAndUpdate(id, req.body);
  winston.info("user updated");
  res.json({ message: "Data updated" });
});

export default usersRoutes;
