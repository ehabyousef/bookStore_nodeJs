import Joi from "joi";
import { model, Schema } from "mongoose";

const AuthorSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
  },
  { timestamps: true }
);

export const Author = model("Author", AuthorSchema);

export function validateAuthor(author) {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(200).required(),
    lastName: Joi.string().min(3).max(200).required(),
    nationality: Joi.string().min(2).max(100).required(),
    image: Joi.string().uri().default("https://via.placeholder.com/150"),
  });
  return schema.validate(author);
}

export function validateUpdateAuthor(author) {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(200).optional(),
    lastName: Joi.string().min(3).max(200).optional(),
    nationality: Joi.string().min(2).max(100).optional(),
    image: Joi.string()
      .uri()
      .default("https://via.placeholder.com/150")
      .optional(),
  });
  return schema.validate(author);
}
