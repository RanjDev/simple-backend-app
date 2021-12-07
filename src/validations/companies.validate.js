import Joi from "joi";

const companiesValidate = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    "string.base": `"Product Name" should be a type of 'text'`,
    "string.empty": `"Product Name" cannot be an empty field`,
    "string.min": `"Product Name" should not be less than {#limit} characters`,
    "any.required": `"Product Name" is a required field`,
  }),
  description: Joi.string().required().messages({
    "string.base": `"Description" should be a type of 'text'`,
    "string.empty": `"Description" cannot be an empty field`,
    "any.required": `"Description" is a required field`,
  }),
});

export default companiesValidate;
