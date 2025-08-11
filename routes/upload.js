import express from "express";
import multer from "multer";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, join(dirname(fileURLToPath(import.meta.url)), "../images"));
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});
const upload = multer({ storage });
export const uploadRouter = express.Router();

uploadRouter.post("/", upload.single("image"), (req, res) => {
  res.status(200).json({ msg: "image uploaded successfully" });
});
