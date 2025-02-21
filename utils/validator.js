import Joi from "joi";

// Register user
export const registerSchema = Joi.object().keys({
  firstName: Joi.string().min(2).max(50).required().messages({
    'any.required': 'First name is required',
    'string.empty': 'First name cannot be empty',
    'string.min': 'First name must be at least 2 characters',
    'string.max': 'First name must be at most 50 characters',
  }),
  lastName: Joi.string().min(2).max(50).optional().messages({
    'string.min': 'Last name must be at least 2 characters',
    'string.max': 'Last name must be at most 50 characters',
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email must be a valid email address',
  }),
  password: Joi.string().min(6).max(255).required().messages({
    'any.required': 'Password is required',
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password must be at least 6 characters',
    'string.max': 'Password must be at most 255 characters',
  }),
  role: Joi.string().valid('shipper', 'carrier', 'driver').required().messages({
    'any.required': 'Role is required',
    'string.empty': 'Role cannot be empty',
    'any.only': 'Role must be one of the following: shipper, carrier, driver',
  }),
});

// Login user
export const loginSchema = Joi.object().keys({
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email must be a valid email address',
  }),
  password: Joi.string().min(6).max(255).required().messages({
    'any.required': 'Password is required',
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password must be at least 6 characters',
    'string.max': 'Password must be at most 255 characters',
  }),
});

