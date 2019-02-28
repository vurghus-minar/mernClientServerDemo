const Joi = require("joi");

const nameSchema = Joi.string().regex(/[a-zA-Z]+/);
const emailSchema = Joi.string().email();

/**
 * Must contain a mix of capital and non capital letters
 * Must contain at least 1 number
 * Must minimum 8-10 characters long
 * Must contain at least 1 special character from the following #$^+=!*()@%&
 * */
const passwordSchema = Joi.string();

const avatarSchema = Joi.string();

exports.registerUserSchema = Joi.object().keys({
  name: nameSchema.required(),
  email: emailSchema.required(),
  password: passwordSchema
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,10}$/)
    .required(),
  avatar: avatarSchema
});

exports.loginUserSchema = Joi.object().keys({
  email: emailSchema.required(),
  password: passwordSchema.required()
});
