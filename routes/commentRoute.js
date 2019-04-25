const passport = require("passport");
const commentController = require("../controllers/commentController");

module.exports = app => {
  // Comments routes

  // Create comment
  app.post(
    "/comment/:snippet_id",
    passport.authenticate("jwt", { session: false }),
    commentController.create
  );

  // Delete comment
  app.delete(
    "/comment/:snippet_id/:comment_id",
    passport.authenticate("jwt", { session: false }),
    commentController.delete
  );
};
