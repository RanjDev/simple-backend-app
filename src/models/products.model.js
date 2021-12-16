import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  quantity: Number,
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Companies",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  image: String,
});

const Product = mongoose.model("Products", productSchema);

export default Product;
