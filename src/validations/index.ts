import Joi from 'joi';

export const createUserSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

export const updateUserSchema = Joi.object({
    name: Joi.string().min(2).max(100),
    email: Joi.string().email(),
}).min(1);

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const addFavoriteSchema = Joi.object({
    productId: Joi.number().integer().positive().required(),
});