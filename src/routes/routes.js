import { Router } from "express";
import Product from "../models/products.model.js";
import productValidate from "../validations/product.validate.js";
import Category from "../models/categories.model.js"; //category model
import categoryValidate from "../validations/categories.validate.js"; //category joi schema
import User from "../models/user.model.js";
import userValidate from "../validations/user.validate.js";

const router = Router();

// Home route
router.get("/", (req, res) => {
  res.send("My server Home Route /");
});

// User routes
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.send("No data here");
  }
});
router.post("/users", async (req, res) => {
  try {
    await userValidate.validateAsync(req.body);
  } catch (err) {
    return res.status(400).send(err.details[0].message);
  }
  const newUser = new User(req.body);
  await newUser.save().then(res.json(newUser));
});
router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.json(user);
});
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndRemove(id);
  } catch (err) {
    return res.send(err + "not deleted");
  }
  res.send(`The deleted user`);
});
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await userValidate.validateAsync(req.body);
  } catch (err) {
    return res.status(400).send(err.details[0].message);
  }
  await User.findByIdAndUpdate(id, req.body).then(res.send(`updated`));
});

// Products routes
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (error) {
    console.log("show products error" + error);
  }
});
router.post("/products", async (req, res) => {
  try {
    await productValidate.validateAsync(req.body);
  } catch (err) {
    // if it is not validated then return will happen and won't post
    return res.status(400).json({ message: err.details[0].message });
  }
  // if validation was alll good then proceeds
  const newProduct = new Product(req.body);
  const c = req.body.category;
  const ctg = await Category.findOne({ name: c }); //the category that is inserted with post request
  newProduct.category = ctg;
  await newProduct.save().then(res.json({ message: "Data Saved" }));
});
router.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate("category");
  res.json(product);
});
router.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndRemove(id).then(
    res.json({ message: "Product Deleted" })
  );
});
router.put("/products/:id", async (req, res) => {
  try {
    console.log(req.body);
    await productValidate.validateAsync(req.body);
  } catch (err) {
    return res.status(400).json({ message: err.details[0].message });
  }
  const { id } = req.params;
  await Product.findOneAndUpdate(
    { _id: id },
    { $set: req.body },
    { new: true }
  ).then(res.json({ message: "Updated" }));
});

// category routes
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.log(err);
  }
});
router.post("/categories", async (req, res) => {
  try {
    await categoryValidate.validateAsync(req.body);
  } catch (err) {
    return res.status(400).send(err.details[0].message);
  }
  const newCategory = new Category(req.body);
  await newCategory.save().then(res.send("New Category Added."));
});
router.get("/categories/:id", async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);

  res.json(category);
});
router.delete("/categories/:id", async (req, res) => {
  const { id } = req.params;
  const deleteCategory = await Category.findByIdAndRemove(id);

  res.send("Category Deleted");
});
router.put("/categories/:id", async (req, res) => {
  try {
    await categoryValidate.validateAsync(req.body);
  } catch (err) {
    return res.status(400).send(err.details[0].message);
  }
  const { id } = req.params;

  await Category.findByIdAndUpdate(id, req.body);
  res.send("update a single category's data");
});

export default router;
