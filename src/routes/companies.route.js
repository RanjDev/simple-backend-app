import { Router } from "express";
import winston from "winston";
import { isAdmin, isLoggedIn } from "../middleware/auth.middleware.js";
import Companies from "../models/company.model.js";
import companiesValidate from "../validations/companies.validate.js";

const companiesRoutes = Router();

companiesRoutes.get("/companies", async (req, res) => {
  try {
    const companies = await Companies.find();
    res.json(companies);
  } catch (err) {
    return res.status(404).json({ error: "Could not get companies" });
  }
});

companiesRoutes.post("/companies", async (req, res) => {
  try {
    await companiesValidate.validateAsync(req.body);
  } catch (err) {
    winston.error(`could not add product, error: ${err.message}`);
    return res.status(400).json({ error: err.message });
  }
  const newCompany = new Companies(req.body);
  await newCompany.save();
  res.json({ message: "company Saved" });
  winston.info("company added");
});

companiesRoutes.get("/companies/:id", async (req, res) => {
  const { id } = req.params;
  let company;
  try {
    company = await Companies.findById(id);
  } catch (err) {
    return res.status(400).json({ error: "Unkown error" });
  }
  res.json(company);
});

companiesRoutes.delete(
  "/companies/:id",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    const { id } = req.params;
    try {
      await Companies.findByIdAndRemove(id);
    } catch (err) {
      winston.error("could not delete company");
      return res.status(400).json({ error: "Unkown error" });
    }
    winston.info("company deleted");
    res.json({ message: "company deleted" });
  }
);

companiesRoutes.put("/companies/:id", isLoggedIn, isAdmin, async (req, res) => {
  try {
    await companiesValidate.validateAsync(req.body);
  } catch (err) {
    winston.error(`could not update, error: ${err.message}`);
    return res.status(400).json({ error: err.message });
  }
  await Companies.findByIdAndUpdate(id, req.body);
  winston.info("company updated");
  res.json({ message: "company updated" });
});

export default companiesRoutes;
