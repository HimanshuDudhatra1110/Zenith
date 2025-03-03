import express, { json } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import diaryRoutes from "./routes/diaryRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";

// Load environment variables from.env file
dotenv.config();

const app = express();

// Enhanced error handler
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser()); // Enable cookie parsing
app.use(helmet()); // Security headers
app.use(compression()); // Compress Response
app.use(morgan("dev")); // Logger

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    timestamp: new Date(),
  });
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/diary", diaryRoutes);
app.use("/api/v1/habit", habitRoutes);

// Handle 404 routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB with retry logic
const connectDB = async () => {
  let retryCount = 0;
  while (retryCount < 5) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`Connected to MongoDB: ${conn.connection.host}`);
      break;
    } catch (err) {
      console.error(
        `Failed to connect to MongoDB. Retrying in 5 seconds... (${
          retryCount + 1
        }/5) : `
      );
      retryCount++;
      setTimeout(connectDB, 5000);
    }
  }
};

// Graceful shutdown
const gracefulShutdown = async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Error during graceful shutdown");
    process.exit(1);
  }
};

// handle termination signal
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

// Start the server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
