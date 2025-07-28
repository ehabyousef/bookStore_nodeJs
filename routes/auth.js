import express from "express";
import expressAsyncHandler from "express-async-handler";
import {
  User,
  validateLoginUser,
  validateRegisterUser,
} from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const registerRoutes = express.Router();

registerRoutes.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    // Validate request body
    const { error } = validateRegisterUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ message: "This user is already registered." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    user = new User({
      email: req.body.email,
      userName: req.body.userName,
      password: hashedPassword,
      isAdmin: req.body.isAdmin,
    });

    const result = await user.save();
    const token = user.generateToken();
    const { password, ...other } = result._doc;
    res.status(201).json({ ...other, token });
  })
);

registerRoutes.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    const { error } = validateLoginUser(req.body);
    if (error) {
      res.status(400).json({ msg: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).json("invalid email or password");
    }

    const isPasswordTrue = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordTrue) {
      res.status(400).json("invalid password");
    }

    const token = jwt.sign(
      { id: user._id, userName: user.userName, isAdmin: user.isAdmin },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    res.status(200).json({ token });
  })
);
