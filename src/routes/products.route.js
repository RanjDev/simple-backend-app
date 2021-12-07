import { Router } from "express";
import winston from "winston";
import { isAdmin, isLoggedIn } from "../middleware/auth.middleware.js";
import Product from "../models/products.model.js";
import Category from "../models/categories.model.js";
import Companies from "../models/company.model.js";
import productValidate from "../validations/product.validate.js";

const productsRoutes = Router();

// Products routes
productsRoutes.get("/products", async (req, res) => {
  try {
    const products = await Product.find().populate(["category", "company"]);
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
  if (!ctg) {
    return res.status(400).json({
      error: `${c} is not a category. Please, choose a valid category.`,
    });
  }
  const comp = req.body.company;
  const compObj = await Companies.findOne({ name: comp });
  if (!compObj) {
    return res.status(400).json({
      error: "there is no such company, please insert a valid company",
    });
  }
  newProduct.company = compObj;
  newProduct.category = ctg;
  await newProduct.save();
  res.json({ message: "Product Saved" });
  winston.info("product added");
});

productsRoutes.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  let product;
  try {
    product = await Product.findById(id).populate(["category", "company"]);
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
  const c = req.body.category;
  const ctg = await Category.findOne({ name: c }); //the category that is inserted with post request
  if (!ctg) {
    return res.status(400).json({
      error: `${c} is not a category. Please, choose a valid category.`,
    });
  }
  const comp = req.body.company;
  const compObj = await Companies.findOne({ name: comp });
  if (!compObj) {
    return res.status(400).json({
      error: "there is no such company, please insert a valid company",
    });
  }

  await Product.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        company: compObj,
        category: ctg,
      },
    },
    { new: true }
  );
  winston.info("product updated");
  res.json({ message: "Product Updated" });
});

export default productsRoutes;
