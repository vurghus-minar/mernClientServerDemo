const Snippet = require("../models/snippetModel");
const snippetRequest = require("../requests/snippetRequest");
const commentSchema = snippetRequest.commentSchema;
const Err = require("../utils/error");

module.exports = {
  create(req, res, next) {
    Snippet.findById(req.params.snippet_id, (err, snippet) => {
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

      commentSchema
        .validate(req.body, { abortEarly: false })
        .then(validComment => {
          validComment.user = req.user.id;
          validComment.name = req.user.name;
          validComment.avatar = req.user.avatar;
          validComment.comment = req.body.comment;

          snippet.comments.unshift(validComment);

          snippet
            .save()
            .then(comment => {
              res.status(200).json([
                comment,
                {
                  message: "Comment successfully created"
                }
              ]);
            })
            .catch(err => {
              next(Err("Error saving comment", 500, { dbAsyncError: err }));
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
    });
  },
  delete(req, res, next) {
    Snippet.findById(req.params.snippet_id, (err, snippet) => {
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
      if (
        snippet.comments.filter(
          comment => comment._id.toString() === req.params.comment_id
        ).length === 0
      ) {
        return res.status(404).json({
          message: "Comment does not exists"
        });
      }

      const removeIndex = snippet.comments
        .map(item => item._id.toString())
        .indexOf(req.params.comment_id);

      snippet.comments.splice(removeIndex, 1);

      snippet
        .save()
        .then(() => {
          res.status(200).json({
            message: "Comment successfully deleted"
          });
        })
        .catch(err => {
          next(Err("Error deleting comment", 500, { dbAsyncError: err }));
        });
    });
  }
};
