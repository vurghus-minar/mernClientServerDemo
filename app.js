const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

// Get logger
const logger = require("./utils/logger");

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
    .on("error", error => {
      logger.error(error);
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

// Log routing errors
app.use((error, req, res, next) => {
  let errorResponse = {};
  if (error) {
    logger.error(error);
    errorResponse.message = "Oops! Something went wrong!";
    if (error.body) {
      errorResponse.errorBody = error.body;
    }
    if (error.type) {
      errorResponse.error = error.type;
    }

    const errorStatusCode = error.statusCode ? error.statusCode : 500;

    res.status(errorStatusCode).send(errorResponse);
  } else {
    if (process.env.NODE_ENV !== "dev") {
      logger.info(req);
    }
    next();
  }
});

// Set up debug
const debug = require("debug");
const name = "mernClientServerDemo";
debug("booting %s", name);

module.exports = app;
