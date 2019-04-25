const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

// Get logger
const logger = require("./utils/logger");
// Get error Handler
const errorHandler = require("./utils/errorHandler");

// Get configuration
const config = require("./config");

const app = express();

// Set up database connection
if (process.env.NODE_ENV !== "test") {
  mongoose.connect(config.db.url, { useNewUrlParser: true });
  mongoose.connection
    .once("open", () => {
      logger.info("Database connected!");
    })
    .on("error", err => {
      logger.error(err);
    });
}

// Set up morgan and the logger for morgan
const morgan = require("morgan");
app.use(morgan(config.morgan.log_type, { stream: logger.stream }));

// Request body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport
app.use(passport.initialize());
require("./configs/passport")(passport);

// Import routes
const routeDir = "./routes/";
const fs = require("fs");
fs.readdirSync(routeDir).forEach(function(file) {
  const route = routeDir + file;
  require(route)(app);
});

// Log errors
app.use(errorHandler);

// Set up debug
const debug = require("debug");
debug("booting %s", config.app.name);

module.exports = app;
