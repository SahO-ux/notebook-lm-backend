import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import { loadModules } from "./server/modulesLoader.js";

dotenv.config();
const app = express();

// CORS Configuration: Allow only specific frontend origin
const allowedOrigins = ["https://notebook-lm-frontend-one.vercel.app/"];
const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"], // Allow specific methods
  credentials: true, // Allow credentials (cookies, authorization headers)
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
};

// Apply CORS middleware globally
app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

// Test route
app.get("/", (req, res) => res.json("Hello"));

const startServer = async () => {
  await loadModules(app);
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  );
};
startServer();
