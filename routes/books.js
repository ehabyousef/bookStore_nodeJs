import express from "express";
import { verifyTokenAndAdmin } from "../middlwares/verifyToken.js";
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/booksController.js";

export const bookRouter = express.Router();

// Get all books with optional price filtering
// Create new book (only admin)
bookRouter.route("/").get(getAllBooks).post(verifyTokenAndAdmin, createBook);

// Get book by ID
// Update book (only admin)
// Delete book (only admin)
bookRouter
  .route("/:id")
  .get(getBookById)
  .put(verifyTokenAndAdmin, updateBook)
  .delete(verifyTokenAndAdmin, deleteBook);
