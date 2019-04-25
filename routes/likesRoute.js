const passport = require("passport");
const likesController = require("../controllers/likesController");

module.exports = app => {
  // Likes routes
  app.post(
    "/snippet/:reqType/:snippet_id",
    passport.authenticate("jwt", { session: false }),
    likesController.toggleLike
  );
};
