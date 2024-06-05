import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import MedcinRouter from "./router/MedcinRouter.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server running on port ${process.env.PORT || 8000}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    if (err.name === "MongoServerError" && err.code === 8000) {
      console.error(
        "Authentication failed. Please check your MongoDB credentials."
      );
    }
    setTimeout(connectionDB, 5000); // Retry connection after 5 seconds
  }
};

connectionDB();
app.use(MedcinRouter);
