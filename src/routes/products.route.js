import { Router } from "express";
import winston from "winston";
import { isAdmin, isLoggedIn } from "../middleware/auth.middleware.js";
import Product from "../models/products.model.js";
import productValidate from "../validations/product.validate.js";

const productsRoutes = Router();

// Products routes
productsRoutes.get("/products", async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (err) {
    return res.status(400).json({ error: "Could Not Get Products" });
  }
});

productsRoutes.post("/products", isLoggedIn, isAdmin, async (req, res) => {
  try {
    await productValidate.validateAsync(req.body);
  } catch (err) {
    // if it is not validated then return will happen and won't post
    winston.error(`could not add product, error: ${err.message}`);
    return res.status(400).json({ error: err.message });
  }
  // if validation was alll good then proceeds

  // conditions to prevent save when category is not find********************
  const newProduct = new Product(req.body);
  const c = req.body.category;
  const ctg = await Category.findOne({ name: c }); //the category that is inserted with post request
  newProduct.category = ctg;
  await newProduct.save();
  res.json({ message: "Product Saved" });
  winston.info("product added");
});

productsRoutes.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  let product;
  try {
    product = await Product.findById(id).populate("category");
  } catch (err) {
    return res.status(400).json({ error: "Unkown error" });
  }
  res.json(product);
});

productsRoutes.delete(
  "/products/:id",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    const { id } = req.params;
    try {
      await Product.findByIdAndRemove(id);
    } catch (err) {
      winston.error("could not delete product");
      return res.status(400).json({ error: "Product Delete Failed" });
    }
    winston.info("product deleted");
    res.json({ message: "Product Deleted" });
  }
);

productsRoutes.put("/products/:id", isLoggedIn, isAdmin, async (req, res) => {
  try {
    await productValidate.validateAsync(req.body);
  } catch (err) {
    winston.err(`could not update product, error: ${err.message}`);
    return res.status(400).json({ error: err.message });
  }
  const { id } = req.params;
  await Product.findOneAndUpdate(
    { _id: id },
    { $set: req.body },
    { new: true }
  );
  winston.info("product updated");
  res.json({ message: "Product Updated" });
});

export default productsRoutes;
