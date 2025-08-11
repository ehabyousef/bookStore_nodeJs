import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { authorRoutes } from "./routes/authors.js";
import { bookRouter } from "./routes/books.js";
import { registerRoutes } from "./routes/auth.js";
import { usersRouter } from "./routes/users.js";
import { passwordRouter } from "./routes/password.js";
import { uploadRouter } from "./routes/upload.js";

import { connectToDb } from "./config/db.js";

import dotenv from "dotenv";

import { looger } from "./middlwares/logger.js";
import { errorHandler, notFound } from "./middlwares/error.js";
import helmet from "helmet";
import cors from "cors";
dotenv.config();

connectToDb();
const app = express();

// static folders
app.use(
  express.static(join(dirname(fileURLToPath(import.meta.url)), "../images"))
);
// helmet secure
app.use(helmet());
// cors  plicy
app.use(cors());
// apply middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(looger);
app.set("view engine", "ejs");

//routes
app.use("/api/author", authorRoutes);
app.use("/api/books", bookRouter);
app.use("/api/auth", registerRoutes);
app.use("/api/users", usersRouter);
app.use("/password", passwordRouter);
app.use("/api/upload", uploadRouter);

// errors handlers

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
