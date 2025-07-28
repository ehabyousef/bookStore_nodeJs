import Joi from "joi";
import { model, mongoose, Schema } from "mongoose";

const booksSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 250,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Author",
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    cover: {
      type: String,
      required: true,
      enum: ["hardcover", "softcover"],
    },
  },
  { timestamps: true }
);

export const Book = model("Book", booksSchema);

export function validateBook(book) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(250).required(),
    author: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(0).required(),
    cover: Joi.string().valid("hardcover", "softcover").required(),
  });
  return schema.validate(book);
}

export function validateUpdateBook(book) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(250).optional(),
    author: Joi.string().optional(),
    description: Joi.string().optional(),
    price: Joi.number().min(0).optional(),
    cover: Joi.string().valid("hardcover", "softcover").optional(),
  });
  return schema.validate(book);
}
