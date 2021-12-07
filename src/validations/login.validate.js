import Joi from "joi";

const loginValidated = Joi.object({
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
});

export default loginValidated;
