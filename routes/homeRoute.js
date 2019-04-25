const homeController = require("../controllers/homeController");
const Err = require("../utils/error");

module.exports = app => {
  // Main routes
  app.get("/", homeController.index);

  // Error Test Routes
  app.get("/test/error", (req, res, next) => {
    next(Err("I couldn't find it.", 404));
  });
};
