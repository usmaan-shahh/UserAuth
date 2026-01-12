import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./configuration/connectDB.js";
import corsOptions from "./configuration/corsOption.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";
import authRouter from "./modules/auth/auth.routes.js";
import userRouter from "./modules/users/user.routes.js";
import logger, { morganStream } from "./utils/logger.js";
import {ensureSuperAdminExists} from "./modules/auth/initSuperAdmin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT;

const app = express();
connectDB();

app.use(
  morgan(":method :url :status :response-time ms", { stream: morganStream }),
);

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/auth", authRouter);
app.use("/users", userRouter);

//Global error handler
app.use(globalErrorHandler); // Always placed at the bottom of server.js, after all routes

//When no route matches the incoming request in your Express app
app.use((req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    return res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    return res.json({ message: "404 Not Found" });
  } else {
    return res.type("txt").send("404 Not Found");
  }
});

//Never start the server before DB connection is successful.
mongoose.connection.once("open", async () => {
  logger.info("Connected to MongoDB");
  await ensureSuperAdminExists();
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
});

//Listens for any MongoDB connection error.
mongoose.connection.on("error", (err) => {
  logger.error("MongoDB connection error:", {
    code: err.code,
    syscall: err.syscall,
    hostname: err.hostname,
    error: err.message,
  });
});
