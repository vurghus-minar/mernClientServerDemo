const Snippet = require("../models/snippetModel");
const Profile = require("../models/profileModel");
const Err = require("../utils/error");
const snippetRequest = require("../requests/snippetRequest");
const commentsSchema = snippetRequest.commentsSchema;
const snippetSchema = snippetRequest.snippetSchema;

module.exports = {
  toggleLike(req, res, next) {
    // Action: /:reqType/:snippet_id
    Profile.findOne({ user: req.user.id }, (err, profile) => {
      if (err) {
        next(
          Err("Error while querying user profile", 500, {
            dbCallbackError: err
          })
        );
      }

      if (!profile) {
        return res.status(404).json({
          message: "No profile exists"
        });
      }

      let like,
        dislike = false;

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
          snippet.likes.filter(like => like.user.toString() === req.user.id)
            .length > 0
        ) {
          like = true;
        }

        if (
          snippet.dislikes.filter(
            dislike => dislike.user.toString() === req.user.id
          ).length > 0
        ) {
          dislike = true;
        }

        if (req.params.reqType === "like") {
          //add like
          if (!like) {
            snippet.likes.unshift({ user: req.user.id });
            snippet
              .save()
              .then(result => {
                if (dislike) {
                  const removeIndex = snippet.dislikes
                    .map(item => item.user.toString())
                    .indexOf(req.user.id);

                  snippet.dislikes.splice(removeIndex, 1);
                  snippet.save().catch(err => {
                    next(
                      Err("Error removing dislike", 500, { dbAsyncError: err })
                    );
                  });
                }
                res.status(200).json({
                  message: "Liked!"
                });
              })
              .catch(err => {
                next(Err("Error liking", 500, { dbAsyncError: err }));
              });
          } else if (like) {
            res.status(400).json({
              message: "Already liked"
            });
          }
        }

        if (req.params.reqType === "dislike") {
          //add dislike
          if (!dislike) {
            snippet.dislikes.unshift({ user: req.user.id });
            snippet
              .save()
              .then(result => {
                if (like) {
                  const removeIndex = snippet.likes
                    .map(item => item.user.toString())
                    .indexOf(req.user.id);

                  snippet.likes.splice(removeIndex, 1);
                  snippet.save().catch(err => {
                    next(
                      Err("Error removing like", 500, { dbAsyncError: err })
                    );
                  });
                }
                res.status(200).json({
                  message: "Disliked!"
                });
              })
              .catch(err => {
                next(Err("Error disliking", 500, { dbAsyncError: err }));
              });
          } else if (dislike) {
            res.status(400).json({
              message: "Already disliked"
            });
          }
        }
      });
    });
  }
};
