import mongoose from "mongoose";

const loginSchema = mongoose.Schema({
  email: String,
  password: String,
});

const LoginModel = mongoose.model("Login", loginSchema);

export default LoginModel;

// This model is only created to make use of the joi library for validating the body of the post request sent from /login
// Otherwise it will not be used to insert data into mongoDB database
