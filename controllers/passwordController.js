import expressAsyncHandler from "express-async-handler";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
/**
 * @description Get forget password view
 * @method      GET
 * @route       /password/forget-password
 * @access      Public
 */

export const getForgetPassword = expressAsyncHandler((req, res) => {
  res.render("forget-password");
});

/**
 * @description Send forget password link
 * @method      POST
 * @route       /password/forget-password
 * @access      Public
 */

export const SendForgetPassword = expressAsyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  const secret = process.env.JWT_SECRET_KEY + user.password;
  const token = jwt.sign({ email: user.email, id: user.id }, secret, {
    expiresIn: "10m",
  });

  const link = `http://localhost:5000/password/reset-password/${user._id}/${token}`;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_ENAIL,
      pass: process.env.USER_PASS,
    },
  });

  const mailOptions = {
    from: process.env.USER_ENAIL,
    to: user.email,
    subject: "Reset Password",
    html: `
        <div>
          <h4>click the link below</h4>
          <p>${link}</p>
        </div>
    `,
  };

  transport.sendMail(mailOptions, function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("email send " + success.response);
    }
  });

  res.render("link-send");
});

/**
 * @description Get reset password view
 * @method      GET
 * @route       /password/reset-password/:userId/:token
 * @access      Public
 */

export const getResetPasswordView = expressAsyncHandler(async (req, res) => {
  console.log(
    "Reset password view requested for userId:",
    req.params.userId,
    "with token:",
    req.params.token
  );

  // Use userId from params, not email, and use await
  const user = await User.findById(req.params.userId);

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  const secret = process.env.JWT_SECRET_KEY + user.password;

  try {
    // Fix typo in 'token' parameter name
    jwt.verify(req.params.token, secret);
    res.render("reset-password", { email: user.email });
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(400).json({ msg: "Invalid or expired token" });
  }
});

/**
 * @description Reset password
 * @method      POST
 * @route       /password/reset-password/:userId/:token
 * @access      Public
 */

export const resetPassword = expressAsyncHandler(async (req, res) => {
  // todo validation

  // Use await and correct format for findById
  const user = await User.findById(req.params.userId);

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  const secret = process.env.JWT_SECRET_KEY + user.password;

  try {
    // Verify token
    jwt.verify(req.params.token, secret);

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);

    // Update user's password
    user.password = hashPass;

    // Save the user (use user.save() not User.save())
    await user.save();

    // Render success page
    res.render("success-password");
  } catch (error) {
    console.error("Token verification failed:", error);
    res
      .status(400)
      .json({ msg: "Invalid or expired token", error: error.message });
  }
});
