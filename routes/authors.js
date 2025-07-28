import express from "express";
import {
  Author,
  validateAuthor,
  validateUpdateAuthor,
} from "../models/Author.js";
import expressAsyncHandler from "express-async-handler";
import { verifyTokenAndAdmin } from "../middlwares/verifyToken.js";
export const authorRoutes = express.Router();

authorRoutes.get("/", async (req, res) => {
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

authorRoutes.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const author = await Author.findById(req.params.id);
    if (author) {
      res.status(200).json(author);
    } else {
      res.status(404).json("not found");
    }
  })
);

//only admin to create
authorRoutes.post("/newAutor", verifyTokenAndAdmin, async (req, res) => {
  const { error } = validateAuthor(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
  }
  try {
    const author = new Author({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      nationality: req.body.nationality,
      image: req.body.image,
    });

    const result = await author.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

//only admin to update
authorRoutes.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  const { error } = validateUpdateAuthor(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
  }
  try {
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
    if (author) {
      res.status(200).json(author);
    }
    res.status(404).json({ msg: "no author found" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

//only admin to delete
authorRoutes.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (author) {
      res.status(200).json({ msg: "deleted" });
    } else {
      res.status(404).json({ msg: "no author found" });
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});
