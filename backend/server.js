import express from "express";
import "dotenv/config";
import connectDB from "./configiration/connectDB.js";
import authRoute from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.js";
import { logEvents, logger } from "./utils/logger.js";
import corsOptions from "./configiration/corsOption.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT;

const app = express();
connectDB();


app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(logger);

app.use("/auth", authRoute);



//Global error handler
app.use(errorHandler);

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
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, function () {
    console.log(`Server is running on ${PORT}`);
  });
});

//Listens for any MongoDB connection error.
mongoose.connection.on('error', (err) => {
  console.log(err);
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
});

