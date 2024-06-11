import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  createStory,
  getStories,
  viewStory,
  deleteStory,
} from "../controllers/stories.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/", verifyToken, upload.single("picture"), createStory);
router.get("/", verifyToken, getStories);
router.post("/view/:id", verifyToken, viewStory);
router.delete("/:id", verifyToken, deleteStory);

export default router;
