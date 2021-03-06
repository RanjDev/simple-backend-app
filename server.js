import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import winston from "winston";
import "winston-mongodb";
import usersRoutes from "./src/routes/users.route.js";
import categoriesRoutes from "./src/routes/categories.route.js";
import productsRoutes from "./src/routes/products.route.js";
import authRoutes from "./src/routes/auth.route.js";
import companiesRoutes from "./src/routes/companies.route.js";
import searchRoute from "./src/routes/search.route.js";

dotenv.config("dotenv");

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

dbConnect();
async function dbConnect() {
  try {
    await mongoose.connect(process.env.DB_URL);
  } catch (error) {
    return console.log(`DB Connection failed ${error}`);
  }
  console.log("DB Connection is a Success");
}

winston.add(
  new winston.transports.MongoDB({
    db: process.env.DB_URL,
    level: "info",
    options: { useUnifiedTopology: true },
  })
);
winston.add(
  new winston.transports.MongoDB({
    db: process.env.DB_URL,
    level: "error",
    options: { useUnifiedTopology: true },
  })
);

app.use(usersRoutes);
app.use(categoriesRoutes);
app.use(productsRoutes);
app.use(authRoutes);
app.use(companiesRoutes);
app.use(searchRoute);

app.listen(process.env.PORT, () => {
  // winston.info("server started");
  console.log(`Server up and running on port ${process.env.PORT}`);
});
