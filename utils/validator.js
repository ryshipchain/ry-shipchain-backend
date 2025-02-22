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

export const shipmentSchemaValidator = Joi.object().keys({
  name: Joi.string().required().messages({
    'any.required': 'Name is required',
    'string.empty': 'Name cannot be empty',
  }),
  pickup: Joi.object().keys({
    address: Joi.object().keys({
      line1: Joi.string().required().messages({
        'any.required': 'Pickup line1 is required',
        'string.empty': 'Pickup line1 cannot be empty',
      }),
      line2: Joi.string().optional().allow(''),
      city: Joi.string().required().messages({
        'any.required': 'Pickup city is required',
        'string.empty': 'Pickup city cannot be empty',
      }),
      state: Joi.string().required().messages({
        'any.required': 'Pickup state is required',
        'string.empty': 'Pickup state cannot be empty',
      }),
      country: Joi.string().required().messages({
        'any.required': 'Pickup country is required',
        'string.empty': 'Pickup country cannot be empty',
      }),
      zip: Joi.string().required().messages({
        'any.required': 'Pickup zip is required',
        'string.empty': 'Pickup zip cannot be empty',
      }),
    }),
    location: Joi.object().keys({
      type: Joi.string().valid('Point').required().messages({
        'any.required': 'Pickup location type is required',
        'string.empty': 'Pickup location type cannot be empty',
        'any.only': 'Pickup location type must be Point',
      }),
      coordinates: Joi.array().items(Joi.number()).length(2).required().messages({
        'any.required': 'Pickup location coordinates are required',
        'array.length': 'Pickup location coordinates must contain 2 numbers',
      }),
    }),
  }),
  dropoff: Joi.object().keys({
    address: Joi.object().keys({
      line1: Joi.string().required().messages({
        'any.required': 'Dropoff line1 is required',
        'string.empty': 'Dropoff line1 cannot be empty',
      }),
      line2: Joi.string().optional().allow(''),
      city: Joi.string().required().messages({
        'any.required': 'Dropoff city is required',
        'string.empty': 'Dropoff city cannot be empty',
      }),
      state: Joi.string().required().messages({
        'any.required': 'Dropoff state is required',
        'string.empty': 'Dropoff state cannot be empty',
      }),
      country: Joi.string().required().messages({
        'any.required': 'Dropoff country is required',
        'string.empty': 'Dropoff country cannot be empty',
      }),
      zip: Joi.string().required().messages({
        'any.required': 'Dropoff zip is required',
        'string.empty': 'Dropoff zip cannot be empty',
      }),
    }),
    location: Joi.object().keys({
      type: Joi.string().valid('Point').required().messages({
        'any.required': 'Dropoff location type is required',
        'string.empty': 'Dropoff location type cannot be empty',
        'any.only': 'Dropoff location type must be Point',
      }),
      coordinates: Joi.array().items(Joi.number()).length(2).required().messages({
        'any.required': 'Dropoff location coordinates are required',
        'array.length': 'Dropoff location coordinates must contain 2 numbers',
      }),
    }),
  }),
  rate: Joi.number().greater(0).required().messages({
    'any.required': 'Rate is required',
    'number.empty': 'Rate cannot be empty',
    'number.greater': 'Rate must be greater than 0',
  }),
  status: Joi.string().valid('created', 'bidding', 'assigned', 'picked-up', 'delivered', 'completed').messages({
    'any.only': 'Status must be one of the following: created, bidding, assigned, picked-up, delivered, completed',
  }),
});

export const getAllShipmentSchemaValidator = Joi.object().keys({
  page: Joi.number().integer().min(1).optional().messages({
    'number.base': 'Page must be a number',
    'number.integer': 'Page must be an integer',
    'number.min': 'Page must be at least 1',
  }),
  limit: Joi.number().integer().min(1).optional().messages({
    'number.base': 'Limit must be a number',
    'number.integer': 'Limit must be an integer',
    'number.min': 'Limit must be at least 1',
  }),
  sortBy: Joi.string().valid('name', 'createdAt', 'updatedAt').optional().messages({
    'string.base': 'Sort by must be a string',
    'any.only': 'Sort by must be one of: name, createdAt, updatedAt',
  }),
  order: Joi.string().valid('asc', 'desc').optional().messages({
    'any.only': 'Order must be one of asc or desc',
  }),
  search: Joi.string().optional().allow('').messages({
    'string.base': 'Search must be a string',
    'string.empty': 'Search cannot be empty',
  }),
});

export const getShipmentSchemaValidator = Joi.object().keys({
  id: Joi.string().messages({
    // 'any.required': 'Shipment ID is required',
    'string.empty': 'Shipment ID cannot be empty',
  }),
});

export const deleteShipmentSchemaValidator = Joi.object().keys({
  id: Joi.string().messages({
    // 'any.required': 'Shipment ID is required',
    'string.empty': 'Shipment ID cannot be empty',
  }),
});

