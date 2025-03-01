import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import winston from "winston";
import dotenv from "dotenv";
import chatRoutes from "./routes/chatRoutes";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000", "http://localhost:5173"];

const logger = winston.createLogger({
  level: NODE_ENV === "development" ? "debug" : "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  defaultMeta: { service: "chat-api" },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
    ...(NODE_ENV === "production" ? [new winston.transports.File({ filename: "logs/error.log", level: "error" }), new winston.transports.File({ filename: "logs/combined.log" })] : []),
  ],
});

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get("User-Agent") || "unknown",
    });
  });

  next();
});

app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      // Проверяем разрешён ли данный origin
      if (ALLOWED_ORIGINS.indexOf(origin) === -1) {
        return callback(new Error("CORS policy violation"), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400, //24 hours cache cors
  })
);

app.use(helmet());

app.use(limiter);

app.use("/api/chat", chatRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Char.fxck API is running!",
    version: "1.0.0",
    status: "ok",
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource does not exist",
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    error: err.name || "Server Error",
    message: NODE_ENV === "production" ? "An unexpected error occurred" : err.message,
    stack: NODE_ENV === "production" ? undefined : err.stack,
  });
});

const server = app.listen(port, () => {
  logger.info(`Server is running in ${NODE_ENV} mode on port ${port}`);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  // В продакшне лучше корректно завершить процесс после критической ошибки
  if (NODE_ENV === "production") {
    server.close(() => {
      process.exit(1);
    });
  }
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", { promise, reason });
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully");
  server.close(() => {
    logger.info("Process terminated");
  });
});

export default app;
