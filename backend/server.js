import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import logger from "./middleware/logger.js";
import { authinticateUser, requirePermission } from "./middleware/auth.js";
import { connectTODatabase } from "./config/database.js";

import menuRoute from "./routes/menuRoute.js";
import orderRoute from "./routes/orderRoute.js";
import inventoryRoute from "./routes/inventoryRoute.js";
import employeeRoute from "./routes/employeesRoute.js";
import tableRoute from "./routes/tablesRoute.js";
import authRoute from "./routes/authRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";
import rolesRoute from "./routes/rolesRoute.js";

const app = express();

const PORT = process.env.PORT || 3000;
const requiredEnvVars = ["JWT_SECRET", "MONGODB_URI"];

const allowedOrigins = [
  "https://resturant-os-frontend-mu.vercel.app",
];
const localhostOriginPattern = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

app.use(express.json());
app.use(logger);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        localhostOriginPattern.test(origin)
      ) {
        return callback(null, true);
      }

      console.warn(`Blocked by CORS: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/auth", authRoute);
app.use("/api/roles", rolesRoute);
app.use("/api/menu", menuRoute);
app.use("/api/dashboard", authinticateUser, requirePermission("dashboard.view"), dashboardRoute);
app.use("/api/orders", authinticateUser, orderRoute);
app.use("/api/inventory", authinticateUser, inventoryRoute);
app.use("/api/employees", authinticateUser, employeeRoute);
app.use("/api/tables", authinticateUser, tableRoute);

const startServer = async () => {
  try {
    const missingEnvVars = requiredEnvVars.filter((name) => !process.env[name]);

    if (missingEnvVars.length > 0) {
      throw new Error(
        `Missing required environment variable(s): ${missingEnvVars.join(", ")}`,
      );
    }

    await connectTODatabase();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("DB connection failed:", error);
    process.exit(1);
  }
};

startServer();
