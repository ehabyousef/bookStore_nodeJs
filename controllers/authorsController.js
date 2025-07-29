import expressAsyncHandler from "express-async-handler";
import {
  Author,
  validateAuthor,
  validateUpdateAuthor,
} from "../models/Author.js";

/**
 * @description Get all authors with pagination
 * @method      GET
 * @route       /api/authors
 * @access      Public
 */
export const getAllAuthors = expressAsyncHandler(async (req, res) => {
  let { page, limit } = req.query;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  let authors;
  if (page && limit) {
    authors = await Author.find()
      .skip((page - 1) * limit)
      .limit(limit);
  } else {
    authors = await Author.find().sort({ firstName: 1 });
  }

  res.status(200).json(authors);
});

/**
 * @description Get author by ID
 * @method      GET
 * @route       /api/authors/:id
 * @access      Public
 */
export const getAuthorById = expressAsyncHandler(async (req, res) => {
  const author = await Author.findById(req.params.id);

  if (author) {
    res.status(200).json(author);
  } else {
    res.status(404).json({ message: "Author not found" });
  }
});

/**
 * @description Create new author
 * @method      POST
 * @route       /api/authors/newAuthor
 * @access      Private (only admin)
 */
export const createAuthor = expressAsyncHandler(async (req, res) => {
  const { error } = validateAuthor(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const author = new Author({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    nationality: req.body.nationality,
    image: req.body.image,
  });

  const savedAuthor = await author.save();
  res.status(201).json(savedAuthor);
});

/**
 * @description Update author
 * @method      PUT
 * @route       /api/authors/:id
 * @access      Private (only admin)
 */
export const updateAuthor = expressAsyncHandler(async (req, res) => {
  const { error } = validateUpdateAuthor(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const author = await Author.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nationality: req.body.nationality,
        image: req.body.image,
      },
    },
    { new: true }
  );

  if (!author) {
    return res.status(404).json({ message: "Author not found" });
  }

  res.status(200).json(author);
});

/**
 * @description Delete author
 * @method      DELETE
 * @route       /api/authors/:id
 * @access      Private (only admin)
 */
export const deleteAuthor = expressAsyncHandler(async (req, res) => {
  const author = await Author.findByIdAndDelete(req.params.id);

  if (!author) {
    return res.status(404).json({ message: "Author not found" });
  }

  res.status(200).json({ message: "Author deleted successfully" });
});
