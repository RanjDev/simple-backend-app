import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  name: String,
  description: String,
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
