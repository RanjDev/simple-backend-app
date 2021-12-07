import mongoose from "mongoose";

const companySchema = mongoose.Schema({
  name: String,
  description: String,
});

const Companies = mongoose.model("Companies", companySchema);

export default Companies;
