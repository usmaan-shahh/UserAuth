import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./configiration/connectDB.js";
connectDB();
import authRoute from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const PORT = process.env.PORT;

// Middleware to parse JSON request body
app.use(express.json()); // express.json() converts incoming JSON data into a JavaScript object. It expects the incoming request to have a JSON body.

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/auth", authRoute);

app.listen(PORT, function () {
  console.log(`Server is running on ${PORT}`);
});
