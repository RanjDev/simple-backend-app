import { Router } from "express";
import Product from "../models/products.model.js";

const searchRoute = Router();

searchRoute.get("/search/:term", async (req, res) => {
  const { term } = req.params;
  try {
    const result = await Product.find({ $text: { $search: term } });
    res.json(result);
  } catch (error) {
    return res.json(error);
  }
});

export default searchRoute;
