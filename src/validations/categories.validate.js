import Joi from "joi";

const categoryValidate = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  description: Joi.string().required(),
});

export default categoryValidate;
