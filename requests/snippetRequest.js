const Joi = require("joi");

const titleSchema = Joi.string();
const prefixSchema = Joi.string();
const bodySchema = Joi.string();
const descriptionSchema = Joi.string();

const commentCommentSchema = Joi.string();

const commentSchema = Joi.object().keys({
  comment: commentCommentSchema.required()
});
exports.commentSchema = commentSchema;

exports.snippetSchema = Joi.object().keys({
  title: titleSchema.required(),
  prefix: prefixSchema.required(),
  body: bodySchema.required(),
  description: descriptionSchema.required(),
  comments: Joi.array().items(commentSchema)
});
