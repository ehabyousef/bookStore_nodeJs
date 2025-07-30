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
// Create new author (only admin)
authorRoutes
  .route("/")
  .get(getAllAuthors)
  .post(verifyTokenAndAdmin, createAuthor);
authorRoutes.get("/", getAllAuthors);

// Get author by ID
// Update author (only admin)
// Delete author (only admin)
authorRoutes
  .route("/")
  .get(getAuthorById)
  .put(verifyTokenAndAdmin, updateAuthor)
  .delete(verifyTokenAndAdmin, deleteAuthor);
