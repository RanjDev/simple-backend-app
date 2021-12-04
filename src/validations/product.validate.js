import Joi from "joi";

const productValidate = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  price: Joi.number().required(),
  description: Joi.string().required(),
  quantity: Joi.number().required(),
  category: Joi.any(),
});

export default productValidate;
