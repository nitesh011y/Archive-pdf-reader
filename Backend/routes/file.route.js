import express from "express";
const router = express.Router();
import { uploadController } from "../controller/file.contoller.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), uploadController);

export default router;
