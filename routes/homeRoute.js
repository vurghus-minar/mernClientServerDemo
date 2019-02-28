const homeController = require("../controllers/homeController");

module.exports = app => {
  // Main routes
  app.get("/", homeController.index);
};
