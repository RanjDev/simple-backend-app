import { Router } from "express";
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

productsRoutes.post("/products", async (req, res) => {
  try {
    await productValidate.validateAsync(req.body);
  } catch (err) {
    // if it is not validated then return will happen and won't post
    return res.status(400).json({ error: err.message });
  }
  // if validation was alll good then proceeds
  const newProduct = new Product(req.body);
  const c = req.body.category;
  const ctg = await Category.findOne({ name: c }); //the category that is inserted with post request
  newProduct.category = ctg;
  await newProduct.save();
  res.json({ message: "Product Saved" });
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

productsRoutes.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndRemove(id);
  } catch (err) {
    return res.status(400).json({ error: "Product Delete Failed" });
  }
  res.json({ message: "Product Deleted" });
});

productsRoutes.put("/products/:id", async (req, res) => {
  try {
    await productValidate.validateAsync(req.body);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
  const { id } = req.params;
  await Product.findOneAndUpdate(
    { _id: id },
    { $set: req.body },
    { new: true }
  );
  res.json({ message: "Product Updated" });
});

export default productsRoutes;
