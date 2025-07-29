import expressAsyncHandler from "express-async-handler";
import { User, validateUpdateUser } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * @description Get all users
 * @method      GET
 * @route       /api/users
 * @access      Private (only admin)
 */
export const getAllUsers = expressAsyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
});

/**
 * @description Get user by ID
 * @method      GET
 * @route       /api/users/:id
 * @access      Private (user himself or admin)
 */
export const getUserById = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});

/**
 * @description Update user
 * @method      PUT
 * @route       /api/users/updateUser/:id
 * @access      Private (user himself or admin)
 */
export const updateUser = expressAsyncHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Hash password if provided
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        email: req.body.email,
        password: req.body.password,
        userName: req.body.userName,
      },
    },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate new token with updated user info
  const token = jwt.sign(
    {
      id: updatedUser._id,
      userName: updatedUser.userName,
      isAdmin: updatedUser.isAdmin,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "15d" }
  );

  res.status(200).json({
    message: "User updated successfully",
    user: updatedUser,
    token,
  });
});

/**
 * @description Delete user
 * @method      DELETE
 * @route       /api/users/:id
 * @access      Private (user himself or admin)
 */
export const deleteUser = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "User deleted successfully" });
});
