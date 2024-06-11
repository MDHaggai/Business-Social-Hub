import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import storyRoutes from "./routes/stories.js"; // Import story routes
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import cron from "node-cron";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

console.log("MongoDB URI:", process.env.MONGO_URL);

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});



// Schedule a job to run every hour
cron.schedule("0 * * * *", async () => {
  try {
    const now = new Date();
    const expiryDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    await Story.deleteMany({ createdAt: { $lt: expiryDate } });
    console.log("Old stories deleted successfully");
  } catch (error) {
    console.error("Error deleting old stories:", error);
  }
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|mp4|mkv|pdf|doc|docx|mp3|wav/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Error: Files of this type are not allowed!");
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), async (req, res) => {
  const user = await register(req, res);
  axios.post('http://localhost:3000/api/users', user)
    .then(() => console.log('User data sent to chat server'))
    .catch(err => console.error('Failed to send user data to chat server:', err));
});
app.post("/posts", verifyToken, upload.single("file"), createPost);

/* ADDITIONAL ROUTES */
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({}, 'firstName lastName _id'); // Fetch only names and IDs
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users: " + error.message });
  }
});

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/stories", storyRoutes); // Use story routes

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(`${err} did not connect`));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
