const passport = require("passport");
const snippetController = require("../controllers/snippetController");

module.exports = app => {
  // Snippet routes

  // Get All snippets
  app.get("/snippets/:user_id?", snippetController.getAllSnippets);

  // Get snippet by id
  app.get("/snippet/:id", snippetController.getSnippetById);

  // Edit own snippet
  app.put(
    "/snippet/:snippet_id",
    passport.authenticate("jwt", { session: false }),
    snippetController.update
  );

  // Delete own snippet
  app.delete(
    "/snippet/:id",
    passport.authenticate("jwt", { session: false }),
    snippetController.delete
  );

  //Create snippet
  app.post(
    "/snippet",
    passport.authenticate("jwt", { session: false }),
    snippetController.create
  );
};
