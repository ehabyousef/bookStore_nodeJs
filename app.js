import express from "express";
import mongoose from "mongoose";
import { authorRoutes } from "./routes/authors.js";
import { bookRouter } from "./routes/books.js";

import dotenv from "dotenv";
import { looger } from "./middlwares/logger.js";
import { errorHandler, notFound } from "./middlwares/error.js";
import { registerRoutes } from "./routes/auth.js";
import { usersRouter } from "./routes/users.js";
import { passwordRouter } from "./routes/password.js";
import { connectToDb } from "./config/db.js";
dotenv.config();

connectToDb();
const app = express();

// apply middlewares
app.use(express.json());
app.use(looger);
app.set("view engine", "ejs");

//routes
app.use("/api/author", authorRoutes);
app.use("/api/books", bookRouter);
app.use("/api/auth", registerRoutes);
app.use("/api/users", usersRouter);
app.use("/password", passwordRouter);

// errors handlers

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
