import express from "express";
import expressAsyncHandler from "express-async-handler";
import { User, validateUpdateUser } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} from "../middlwares/verifyToken.js";
export const usersRouter = express.Router();

// get all users only admins
usersRouter.get(
  "/",
  verifyTokenAndAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  })
);

// get user
usersRouter.get(
  "/:id",
  verifyTokenAndAuthorization,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.status(200).json(user);
    }
    res.status(404).json({ msg: "not found user" });
  })
);

// update user
usersRouter.put(
  "/updateUser/:id",
  verifyTokenAndAuthorization,
  expressAsyncHandler(async (req, res) => {
    const { error } = validateUpdateUser(req.body);
    if (error) {
      res.status(400).json({ msg: error.details[0].message });
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.params = await bcrypt.hash(req.body.password, salt);
    }

    const newUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          email: req.params.email,
          password: req.params.password,
          userName: req.params.userName,
        },
      },
      { new: true }
    ).select("-password");

    const token = jwt.sign(
      {
        id: newUser._id,
        userName: newUser.userName,
        isAdmin: newUser.isAdmin,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15d" }
    );

    res.status(200).json({ msg: "updated successfully", token });
  })
);

// delete user
usersRouter.delete(
  "/:id",
  verifyTokenAndAuthorization,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ msg: "user deleted successfuly" });
    }
    res.status(404).json({ msg: "user not found" });
  })
);
