const passport = require("passport");
const profileController = require("../controllers/profileController");

module.exports = app => {
  // Profile routes
  //Authenticated route
  app.get(
    "/profile",
    passport.authenticate("jwt", { session: false }),
    profileController.index
  );
  app.post(
    "/profile",
    passport.authenticate("jwt", { session: false }),
    profileController.create
  );
  app.put("/profile", profileController.update);
  app.delete("/profile/:id", profileController.delete);
};
