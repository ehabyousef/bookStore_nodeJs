import expressAsyncHandler from "express-async-handler";

/**
 * @description Get forget password view
 * @method      GET
 * @route       /password/forget-password
 * @access      Public
 */

export const getForgetPassword = expressAsyncHandler((req, res) => {
  res.render("forget-password");
});
