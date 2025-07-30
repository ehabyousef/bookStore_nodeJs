import express from "express";
import { getForgetPassword } from "../controllers/passwordController.js";

export const passwordRouter = express.Router();

passwordRouter.route("/forget-password").get(getForgetPassword);
