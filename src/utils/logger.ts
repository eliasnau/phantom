import winston from "winston";
import path from "path";

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), "logs");
require("fs").mkdirSync(logsDir, { recursive: true });

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true })
  ),
  transports: [
    // Console logging (formatted)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...metadata }) => {
          let msg = `${timestamp} [${level}]: ${message}`;
          if (Object.keys(metadata).length > 0) {
            msg += ` ${JSON.stringify(metadata)}`;
          }
          return msg;
        })
      ),
    }),

    new winston.transports.File({
      filename: path.join(logsDir, "error.json"),
      level: "error",
      format: winston.format.json(),
    }),

    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
    }),

    new winston.transports.File({
      filename: path.join(logsDir, "access.json"),
      level: "http",
      format: winston.format.json(),
    }),

    new winston.transports.File({
      filename: path.join(logsDir, "debug.log"),
      level: "debug",
    }),

    new winston.transports.File({
      filename: path.join(logsDir, "info.json"),
      level: "info",
      format: winston.format.json(),
    }),
  ],
});

export default logger;

export const logError = (message: string, error: any) => {
  logger.error(message, {
    error: error.message,
    stack: error.stack,
    ...error,
  });
};

export const logInfo = (message: string, meta?: any) => {
  logger.info(message, meta);
};

export const logDebug = (message: string, meta?: any) => {
  logger.debug(message, meta);
};

export const logHttp = (message: string, meta?: any) => {
  logger.http(message, meta);
};
