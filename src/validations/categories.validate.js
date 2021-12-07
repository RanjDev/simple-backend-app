import Joi from "joi";

const categoryValidate = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    "string.base": `"Category Name" should be a type of 'text'`,
    "string.empty": `"Category Name" cannot be an empty field`,
    "string.min": `"Category Name" should not be less than {#limit} characters`,
    "any.required": `"Category Name" is a required field`,
  }),
  description: Joi.string().required().messages({
    "string.base": `"Category Description" should be a type of 'text'`,
    "string.empty": `"Category Description" cannot be an empty field`,
    "string.min": `"Category Description" should not be less than {#limit} characters`,
    "any.required": `"Category Description" is a required field`,
  }),
});

export default categoryValidate;
