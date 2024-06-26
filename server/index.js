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
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";

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
const upload = multer({ storage: storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), async (req, res) => {
  const user = await register(req, res);
  axios.post('http://localhost:3000/api/users', user)
    .then(() => console.log('User data sent to chat server'))
    .catch(err => console.error('Failed to send user data to chat server:', err));
});
app.post("/posts", verifyToken, upload.single("picture"), createPost);

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
