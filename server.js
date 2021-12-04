import express from "express";
import mongoose from "mongoose";
import router from "./src/routes/routes.js";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

dbConnect();
async function dbConnect() {
  try {
    await mongoose
      .connect("mongodb://localhost:27017/ecommerce-prac")
      .then(console.log("DB Connected Successfully"));
  } catch (error) {
    console.log(`DB Connection failed ${error}`);
  }
}

app.use(router);

app.listen(5000, () => {
  console.log("Server up and running on port 5000");
});
