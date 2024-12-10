import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoute from "./src/routes/auth.route.js";
import pokemonRoute from "./src/routes/pokemon.route.js";
import { connectDB } from "./src/lib/db.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:4200", "http://localhost:5001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/auth", authRoute);
app.use("/api/pokemon", pokemonRoute);

app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
  connectDB();
});
