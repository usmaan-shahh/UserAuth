import express from "express";
const app = express();
import "dotenv/config";
import connectDB from "./configiration/connectDB.js";
connectDB();
import authRoute from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.js";
import { logger } from "./utils/logger.js";
import corsOptions from "./configiration/corsOption.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from './routes/usersRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const PORT = process.env.PORT;

// Middleware to parse JSON request body
app.use(express.json()); // express.json() converts incoming JSON data into a JavaScript object. It expects the incoming request to have a JSON body.

app.use(cookieParser());

app.use(cors(corsOptions));
app.use(logger);
app.use("/api/auth", authRoute);
app.use('/users', userRoutes);
app.use(errorHandler);

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

app.listen(PORT, function () {
  console.log(`Server is running on ${PORT}`);
});
