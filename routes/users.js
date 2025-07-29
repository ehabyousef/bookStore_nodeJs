import express from "express";
import {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} from "../middlwares/verifyToken.js";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/usersController.js";

export const usersRouter = express.Router();

// Get all users (only admins)
usersRouter.get("/", verifyTokenAndAdmin, getAllUsers);

// Get user by ID (user himself or admin)
usersRouter.get("/:id", verifyTokenAndAuthorization, getUserById);

// Update user (user himself or admin)
usersRouter.put("/updateUser/:id", verifyTokenAndAuthorization, updateUser);

// Delete user (user himself or admin)
usersRouter.delete("/:id", verifyTokenAndAuthorization, deleteUser);
