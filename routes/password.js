import express from "express";
import {
  getForgetPassword,
  getResetPasswordView,
  resetPassword,
  SendForgetPassword,
} from "../controllers/passwordController.js";

export const passwordRouter = express.Router();

passwordRouter
  .route("/forget-password")
  .get(getForgetPassword)
  .post(SendForgetPassword);

passwordRouter
  .route("/reset-password/:userId/:token")
  .get(getResetPasswordView)
  .post(resetPassword);
