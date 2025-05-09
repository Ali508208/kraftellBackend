const Joi = require("joi");

const registerSchema = Joi.object({
  role: Joi.string().valid("buyer", "manufacture").required(),
  companyType: Joi.string().when("role", {
    is: "buyer",
    then: Joi.required(),
  }),
  brandName: Joi.string().when("role", {
    is: "manufacture",
    then: Joi.required(),
  }),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  location: Joi.string().required(),
  phoneNumber: Joi.string().when("role", {
    is: "manufacture",
    then: Joi.required(),
  }),
  productCategories: Joi.array().items(Joi.string()),
  manufacturingCapabilities: Joi.object({
    productTypes: Joi.array().items(Joi.string()),
    materials: Joi.array().items(Joi.string()),
    processes: Joi.array().items(Joi.string()),
  }),
  certifications: Joi.array().items(Joi.string()),
  portfolio: Joi.array().items(Joi.string()),
});

module.exports = { registerSchema };
