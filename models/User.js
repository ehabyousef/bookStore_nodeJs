import Joi from "joi";
import { model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
const usersSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

usersSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id,
      userName: this.userName,
      isAdmin: this.isAdmin,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "15d",
    }
  );
};
export const User = model("User", usersSchema);

export function validateRegisterUser(user) {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(100).required(),
    userName: Joi.string().min(3).max(200).required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(user);
}

export function validateLoginUser(user) {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(100).required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(user);
}

export function validateUpdateUser(user) {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(100).optional(),
    userName: Joi.string().min(3).max(200).optional(),
    password: Joi.string().min(6).optional(),
  });
  return schema.validate(user);
}
export function validateChangePassword(user) {
  const schema = Joi.object({
    password: Joi.string().min(6).required(),
  });
  return schema.validate(user);
}
