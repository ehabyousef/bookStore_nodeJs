import expressAsyncHandler from "express-async-handler";
import {
  User,
  validateRegisterUser,
  validateLoginUser,
} from "../models/User.js";
import bcrypt from "bcryptjs";

/**
 * @description Register new user
 * @method      POST
 * @route       /api/auth/register
 * @access      Public
 */

export const registerUser = expressAsyncHandler(async (req, res) => {
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User already exists with this email" });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create new user
  const user = new User({
    email: req.body.email,
    userName: req.body.userName,
    password: hashedPassword,
  });

  const savedUser = await user.save();

  // Generate token
  const token = savedUser.generateToken();

  // Remove password from response
  const { password, ...userWithoutPassword } = savedUser._doc;

  res.status(201).json({
    message: "User registered successfully",
    user: userWithoutPassword,
    token,
  });
});

/**
 * @description Login user
 * @method      POST
 * @route       /api/auth/login
 * @access      Public
 */

export const loginUser = expressAsyncHandler(async (req, res) => {
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Check if user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Generate token
  const token = user.generateToken();

  // Remove password from response
  const { password, ...userWithoutPassword } = user._doc;

  res.status(200).json({
    message: "Login successful",
    user: userWithoutPassword,
    token,
  });
});
