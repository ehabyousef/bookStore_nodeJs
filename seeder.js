import { connectToDb } from "./config/db.js";
import { authors, books } from "./data.js";
import { Author } from "./models/Author.js";
import { Book } from "./models/Books.js";
import dotenv from "dotenv";

dotenv.config();

connectToDb();

const importBooks = async () => {
  try {
    await Book.insertMany(books);
    console.log("imported ..");
  } catch (error) {
    console.log("failed to import ..");
    process.exit(1);
  }
};

const removeBooks = async () => {
  try {
    await Book.deleteMany(books);
    console.log("deleted ..");
  } catch (error) {
    console.log("failed to remove ..");
    process.exit(1);
  }
};

const importAuthors = async () => {
  try {
    await Author.insertMany(authors);
    console.log("authors imported suuccessfully");
  } catch (error) {
    console.log("falied to import");
    process.exit(1);
  }
};

const removeAuthors = async () => {
  try {
    await Book.deleteMany(authors);
    console.log("deleted ..");
  } catch (error) {
    console.log("failed to remove ..");
    process.exit(1);
  }
};

if (process.argv[2] === "-import") {
  importBooks();
} else if (process.argv[2] === "-remove") {
  removeBooks();
} else if (process.argv[2] === "-importAuthors") {
  importAuthors();
} else if (process.argv[2] === "-removeAuthors") {
  removeAuthors();
}
