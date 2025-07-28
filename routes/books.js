import express from "express";
import asyncHandler from "express-async-handler";
import { Book, validateBook } from "../models/Books.js";
import { verifyTokenAndAdmin } from "../middlwares/verifyToken.js";

export const bookRouter = express.Router();

bookRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    let books;
    const { minPrice, maxPrice } = req.query;
    if (minPrice && maxPrice) {
      books = await Book.find({ price: { $gte: minPrice, $lte: maxPrice } })
        .sort({ title: 1 })
        .populate("author");
    } else {
      books = await Book.find().sort({ createdAt: -1 }).populate("author");
    }
    res.status(200).json(books);
  })
);

bookRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id).populate("author");
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json("not found");
    }
  })
);

//only admin to create
/**
 * @description create new book
 * @method      post
 * @route       /api/books/newbook
 * @access      private (only admin)
 */

bookRouter.post("/newBook", verifyTokenAndAdmin, async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      price: req.body.price,
      cover: req.body.cover,
    });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

//only admin to update
/**
 * @description create put book
 * @method      put
 * @route       /api/books/updateBook
 * @access      private (only admin)
 */

bookRouter.put("/updateBook/:id", verifyTokenAndAdmin, async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          author: req.body.author,
          description: req.body.description,
          price: req.body.price,
          cover: req.body.cover,
        },
      },
      { new: true }
    ).populate("author");
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

//only admin to delete
/**
 * @description create delete book
 * @method      delete
 * @route       /api/books/deleteBook
 * @access      private (only admin)
 */

bookRouter.delete(
  "/deleteBook/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  })
);
