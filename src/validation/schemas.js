/**
 * @file Schémas de validation Joi
 */
const Joi = require('joi');

const userCreateSchema = Joi.object({
  username: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required()
});

const userUpdateSchema = Joi.object({
  username: Joi.string().min(2).max(50),
});

const catwayCreateSchema = Joi.object({
  catwayNumber: Joi.number().integer().min(1).required(),
  catwayType: Joi.string().valid('long', 'short').required(),
  catwayState: Joi.string().allow('', null)
});

const catwayUpdateSchema = Joi.object({
  catwayState: Joi.string().required()
});

const reservationCreateSchema = Joi.object({
  clientName: Joi.string().min(2).required(),
  boatName: Joi.string().min(2).required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().greater(Joi.ref('startDate')).required()
});

module.exports = {
  userCreateSchema,
  userUpdateSchema,
  catwayCreateSchema,
  catwayUpdateSchema,
  reservationCreateSchema
};
