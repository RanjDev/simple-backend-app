import Joi from "joi";

const productValidate = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    "string.base": `"Product Name" should be a type of 'text'`,
    "string.empty": `"Product Name" cannot be an empty field`,
    "string.min": `"Product Name" should not be less than {#limit} characters`,
    "any.required": `"Product Name" is a required field`,
  }),
  price: Joi.number().required().messages({
    "string.base": `"Price" should be a type of 'number'`,
    "string.empty": `"Price" cannot be an empty field`,
    "any.required": `"Price" is a required field`,
  }),
  description: Joi.string().required().messages({
    "string.base": `"Description" should be a type of 'text'`,
    "string.empty": `"Description" cannot be an empty field`,
    "any.required": `"Description" is a required field`,
  }),
  quantity: Joi.number().required().messages({
    "string.base": `"Quantityy" should be a type of 'number'`,
    "string.empty": `"Quantityy" cannot be an empty field`,
    "any.required": `"Quantityy" is a required field`,
  }),
  category: Joi.any(),
});

export default productValidate;
