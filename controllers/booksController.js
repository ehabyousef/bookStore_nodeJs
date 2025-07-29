import asyncHandler from "express-async-handler";
import { Book, validateBook } from "../models/Books.js";

/**
 * @description Get all books with optional price filtering
 * @method      GET
 * @route       /api/books
 * @access      Public
 */

export const getAllBooks = asyncHandler(async (req, res) => {
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
});

/**
 * @description Get book by ID
 * @method      GET
 * @route       /api/books/:id
 * @access      Public
 */

export const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate("author");

  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

/**
 * @description Create new book
 * @method      POST
 * @route       /api/books/newbook
 * @access      Private (only admin)
 */

export const createBook = asyncHandler(async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    price: req.body.price,
    cover: req.body.cover,
  });

  const savedBook = await book.save();
  res.status(201).json(savedBook);
});

/**
 * @description Update book
 * @method      PUT
 * @route       /api/books/updateBook/:id
 * @access      Private (only admin)
 */

export const updateBook = asyncHandler(async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

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
});

/**
 * @description Delete book
 * @method      DELETE
 * @route       /api/books/deleteBook/:id
 * @access      Private (only admin)
 */

export const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.status(200).json({ message: "Book deleted successfully" });
});
