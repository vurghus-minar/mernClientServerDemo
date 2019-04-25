const Snippet = require("../models/snippetModel");
const Profile = require("../models/profileModel");
const Err = require("../utils/error");
const snippetRequest = require("../requests/snippetRequest");
const commentsSchema = snippetRequest.commentsSchema;
const snippetSchema = snippetRequest.snippetSchema;

module.exports = {
  getAllSnippets(req, res, next) {
    // Get User's snippets if user_id param supplied
    // Else get all snippets
    let query = {};
    if (req.params.user_id) {
      query = { user: req.params.user_id };
    }
    Snippet.find(query)
      .sort({ date: -1 })
      .then(snippets => {
        res.status(200).json(snippets);
      })
      .catch(err => {
        next(Err("Error fetching snippets", 500, { dbAsyncError: err }));
      });
  },
  getSnippetById(req, res, next) {
    Snippet.findById(req.params.id, (err, snippet) => {
      if (err) {
        next(
          Err("Error fetching snippet by Id", 500, { dbCallbackError: err })
        );
      }
      if (!snippet) {
        return res.status(404).json({
          message: "No snippet exists"
        });
      }
      res.status(200).json(snippet);
    });
  },
  create(req, res, next) {
    snippetSchema
      .validate(req.body, { abortEarly: false })
      .then(validSnippet => {
        validSnippet.user = req.user.id;
        validSnippet.name = req.user.name;
        validSnippet.avatar = req.user.avatar;
        new Snippet(validSnippet)
          .save()
          .then(snippet => {
            res.status(200).json([
              snippet,
              {
                message: "Snippet successfully created"
              }
            ]);
          })
          .catch(err => {
            next(Err("Error saving snippet", 500, { dbAsyncError: err }));
          });
      })
      .catch(validationError => {
        next(
          Err("Validation Error", 422, {
            validationErrorObject: validationError,
            validationErrors: validationError.details.map(d => d.message)
          })
        );
      });
  },
  update(req, res, next) {
    Profile.findOne({ user: req.user.id }, (err, profile) => {
      if (err) {
        next(Err("Error fetching user profile", 500, { dbCallbackError: err }));
      }

      if (!profile) {
        return res.status(404).json({
          profile: "No profile exists"
        });
      }
      snippetSchema
        .validate(req.body, { abortEarly: false })
        .then(validSnippet => {
          validSnippet.user = req.user.id;
          validSnippet.name = req.user.name;
          validSnippet.avatar = req.user.avatar;
          console.log(req.params.snippet_id);
          console.log(validSnippet);
          Snippet.findOneAndUpdate(
            { _id: req.params.snippet_id },
            { $set: validSnippet },
            { new: true },
            (err, snippet) => {
              console.log(snippet);
              if (err) {
                next(
                  Err("Error fetching snippet", 500, {
                    dbCallbackError: err
                  })
                );
              }
              if (!snippet) {
                return res.status(404).json({
                  message: "No snippet exists"
                });
              }
              res.status(200).json([
                snippet,
                {
                  message: "Snippet successfully updated"
                }
              ]);
            }
          );
        })
        .catch(validationError => {
          next(
            Err("Validation Error", 422, {
              validationErrorObject: validationError,
              validationErrors: validationError.details.map(d => d.message)
            })
          );
        });
    });
  },
  delete(req, res, next) {
    Profile.findOne({ user: req.user.id }, (err, profile) => {
      if (err) {
        next(Err("Error fetching user profile", 500, { dbCallbackError: err }));
      }

      if (!profile) {
        return res.status(404).json({
          profile: "No profile exists"
        });
      }

      Snippet.findById(req.params.id, (err, snippet) => {
        if (err) {
          next(Err("Error fetching snippet", 500, { dbCallbackError: err }));
        }
        if (!snippet) {
          return res.status(404).json({
            message: "No snippet exists"
          });
        }
        if (snippet.user.toString() !== req.user.id) {
          return res.status(401).json({
            message: "You are not authorized to delete this snippet."
          });
        }
        snippet
          .remove()
          .then(snippet => {
            res.status(200).json([
              snippet,
              {
                message: "Snippet successfully removed"
              }
            ]);
          })
          .catch(err => {
            next(Err("Error deleting snippet", 500, { dbAsyncError: err }));
          });
      });
    });
  }
};
