import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./configiration/connectDB.js";
connectDB();
import authRoute from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT;

// Middleware to parse JSON request body
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);

app.listen(PORT, function () {
  console.log(`Server is running on ${PORT}`);
});
