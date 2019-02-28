/**
 * Configure Winston
 */
const config = require("../config");
var winston = require("winston");
const fs = require("fs");

const env = process.env.NODE_ENV;
const logDir = `./${config.logs.dir}`;
const archiveDir = `${logDir}/archives`;
const errorFileName = `${logDir}/${config.logs.err_file}`;
const dailyLogFileName = `${logDir}/%DATE%-${config.logs.log_file}`;

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

if (!fs.existsSync(archiveDir)) {
  fs.mkdirSync(archiveDir);
}

const DailyRotateFile = require("winston-daily-rotate-file");

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      level: "error",
      filename: errorFileName,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: true
    }),
    new DailyRotateFile({
      filename: dailyLogFileName,
      datePattern: "DD-MM-YYYY",
      prepend: true,
      json: true,
      level: "info"
    }).on("rotate", (oldFilename, newFilename) => {
      fs.rename(
        `${logDir}/${oldFilename}`,
        `${archiveDir}/${oldFilename}`,
        err => {
          if (err) throw err;
          console.log("Daily log moved");
        }
      );
    }),
    new winston.transports.Console({
      level: "info",
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (env !== "prod") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  );
}

logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  }
};

module.exports = logger;
