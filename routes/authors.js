import express from "express";
import { verifyTokenAndAdmin } from "../middlwares/verifyToken.js";
import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../controllers/authorsController.js";

export const authorRoutes = express.Router();

// Get all authors with pagination
authorRoutes.get("/", getAllAuthors);

// Get author by ID
authorRoutes.get("/:id", getAuthorById);

// Create new author (only admin)
authorRoutes.post("/newAuthor", verifyTokenAndAdmin, createAuthor);

// Update author (only admin)
authorRoutes.put("/:id", verifyTokenAndAdmin, updateAuthor);

// Delete author (only admin)
authorRoutes.delete("/:id", verifyTokenAndAdmin, deleteAuthor);
