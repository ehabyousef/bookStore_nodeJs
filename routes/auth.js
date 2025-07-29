import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

export const registerRoutes = express.Router();

// Register new user
registerRoutes.post("/register", registerUser);

// Login user
registerRoutes.post("/login", loginUser);
