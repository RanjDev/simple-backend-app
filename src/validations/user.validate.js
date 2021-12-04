import Joi from "joi";

const userValidated = Joi.object({
  firstName: Joi.string().min(2).max(255).required(),
  lastName: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().min(6).max(255).required(),
  password: Joi.string().min(6).max(255).required(),
  role: Joi.string().min(4).max(255).required(),
});

export default userValidated;
