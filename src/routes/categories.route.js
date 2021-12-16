import { Router } from "express";
import winston from "winston";
import { isAdmin, isLoggedIn } from "../middleware/auth.middleware.js";
import Category from "../models/categories.model.js";
import categoryValidate from "../validations/categories.validate.js";

const categoriesRoutes = Router();

// category routes
categoriesRoutes.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    return res.status(400).json({ error: "Unkown error" });
  }
});

categoriesRoutes.post("/categories", async (req, res) => {
  try {
    await categoryValidate.validateAsync(req.body);
  } catch (err) {
    winston.error(`Could not add category, error: ${err.message}`);
    return res.status(400).json({ error: err.message });
  }
  const newCategory = new Category(req.body);
  await newCategory.save();
  winston.info("new category added");
  res.json({ message: "New Category Added" });
});

categoriesRoutes.get("/categories/:id", async (req, res) => {
  const { id } = req.params;
  let category;
  try {
    category = await Category.findById(id);
  } catch (err) {
    return res.status(404).json({ error: "Could not find category" });
  }

  res.json(category);
});

categoriesRoutes.delete(
  "/categories/:id",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    const { id } = req.params;
    try {
      await Category.findByIdAndRemove(id);
    } catch (err) {
      winston.error("could not delete category");
      return res.status(400).json({ error: "Category Delete Failed" });
    }
    winston.info("category deleted");
    res.json({ message: "Category Deleted" });
  }
);

categoriesRoutes.put(
  "/categories/:id",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    const { id } = req.params;

    try {
      await categoryValidate.validateAsync(req.body);
    } catch (err) {
      winston.error(`category update failed, error: ${err.message}`);
      return res.status(400).json({ error: err.message });
    }

    await Category.findByIdAndUpdate(id, req.body);
    winston.info("category updated");
    res.json({ message: "Category updated" });
  }
);

export default categoriesRoutes;
