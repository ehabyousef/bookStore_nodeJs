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
// Update user (user himself or admin)
// Delete user (user himself or admin)
usersRouter
  .route("/:id")
  .get(verifyTokenAndAuthorization, getUserById)
  .put(verifyTokenAndAuthorization, updateUser)
  .delete(verifyTokenAndAuthorization, deleteUser);
