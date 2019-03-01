const passport = require("passport");
const userController = require("../controllers/userController");

module.exports = app => {
  // User routes

  app.post("/user/register", userController.register);
  app.post("/user/login", userController.login);
};
