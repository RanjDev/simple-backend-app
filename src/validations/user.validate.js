import Joi from "joi";

const userValidated = Joi.object({
  firstName: Joi.string().min(2).max(255).required().messages({
    "string.base": `"First Name" should be a type of 'text'`,
    "string.empty": `"First Name" cannot be an empty field`,
    "string.min": `"First Name" should not be less than {#limit} characters`,
    "any.required": `"First Name" is a required field`,
  }),
  lastName: Joi.string().min(2).max(255).required().messages({
    "string.base": `"Last Name" should be a type of 'text'`,
    "string.empty": `"Last Name" cannot be an empty field`,
    "string.min": `"Last Name" should not be less than {#limit} characters`,
    "any.required": `"Last Name" is a required field`,
  }),
  email: Joi.string()
    .email()
    .required()
    .regex(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/)
    .messages({
      "string.empty": `"Email" cannot be an empty field`,
      "any.required": `"Email" is a required field`,
      "string.pattern.base": `"Email" should be a valid email format`,
    }),
  password: Joi.string()
    .min(8)
    .max(30)
    .regex(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,30}$/)
    .required()
    .messages({
      "string.empty": `"Password" cannot be an empty field`,
      "string.pattern.base": `"Password" must be 8-30 characters, and include capital and small letters, numbers, and a symbol.`,
    }),
  role: Joi.string().min(4).max(255).required(),
});

export default userValidated;
