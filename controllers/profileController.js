const Profile = require("../models/profileModel");
require("../models/userModel");
const Err = require("../utils/error");
const profileRequest = require("../requests/profileRequest");
const profileSchema = profileRequest.profileSchema;
const profileHandleSchema = profileRequest.profileHandleSchema;
const profileUserIdSchema = profileRequest.profileUserIdSchema;
const experienceSchema = profileRequest.experienceSchema;
const educationSchema = profileRequest.educationSchema;

module.exports = {
  index(req, res, next) {
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

      res.status(200).json(profile);
    });
  },
  getProfileByHandle(req, res, next) {
    profileHandleSchema
      .validate(req.params, { abortEarly: false })
      .then(validHandle => {
        Profile.findOne({ handle: req.params.handle })
          .populate("user", ["name", "avatar"])
          .exec()
          .then(profile => {
            if (!profile) {
              return res.status(404).json({
                message: "No profile exists"
              });
            }
            res.status(200).json(profile);
          })
          .catch(err => {
            next(
              Err("Error while querying user profile by handle", 500, {
                dbAsyncError: err
              })
            );
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
  getProfileByUserId(req, res, next) {
    profileUserIdSchema
      .validate(req.params, { abortEarly: false })
      .then(validUserId => {
        Profile.findOne({ user: req.params.user_id })
          .populate("user", ["name", "avatar"])
          .exec()
          .then(profile => {
            if (!profile) {
              return res.status(404).json({
                message: "No profile exists"
              });
            }
            res.status(200).json(profile);
          })
          .catch(err => {
            next(
              Err("Error while querying user profile by id", 500, {
                dbAsyncError: err
              })
            );
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
  getAllProfiles(req, res, next) {
    Profile.find()
      .populate("user", ["name", "avatar"])
      .exec()
      .then(profiles => {
        if (!profiles) {
          return res.status(404).json({
            message: "No profiles exists"
          });
        }
        res.status(200).json(profiles);
      })
      .catch(err => {
        next(
          Err("Error while querying profiles", 500, {
            dbAsyncError: err
          })
        );
      });
  },
  create(req, res, next) {
    profileSchema
      .validate(req.body, { abortEarly: false })
      .then(validProfile => {
        validProfile.user = req.user.id;
        if (typeof req.body.skills !== "undefined") {
          validProfile.skills = req.body.skills.split(",");
        }

        Profile.findOne({ user: req.user.id }, (err, profile) => {
          if (err) {
            next(
              Err("Error while querying user profile", 500, {
                dbCallbackError: err
              })
            );
          }
          if (profile) {
            //Update
            Profile.findOneAndUpdate(
              { user: req.user.id },
              { $set: validProfile },
              { new: true },
              (err, profile) => {
                if (err) {
                  next(
                    Err("Error while updating user profile", 500, {
                      dbCallbackError: err
                    })
                  );
                }
                res
                  .status(200)
                  .json([profile, { message: "Profile successfully updates" }]);
              }
            );
          } else {
            //create
            //check if handle exists
            Profile.findOne({ handle: validProfile.handle }, (err, profile) => {
              if (err) {
                next(
                  Err("Error while creating user profile", 500, {
                    dbCallbackError: err
                  })
                );
              }
              if (profile) {
                res.status(400).json({
                  message: "The handle already exist"
                });
              }
              new Profile(validProfile)
                .save()
                .then(profile => {
                  res.status(200).json([
                    profile,
                    {
                      message: "Profile successfully saved"
                    }
                  ]);
                })
                .catch(err => {
                  next(
                    Err("Error while saving profile", 500, {
                      dbAsyncError: err
                    })
                  );
                });
            });
          }
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
  createExperience(req, res, next) {
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

      experienceSchema
        .validate(req.body, { abortEarly: false })
        .then(validExperience => {
          profile.experience.unshift(validExperience);
          profile
            .save()
            .then(profile => {
              res.status(200).json([
                profile,
                {
                  message: "Profile experience successfully saved"
                }
              ]);
            })
            .catch(err => {
              next(
                Err("Error while saving profile experience", 500, {
                  dbAsyncError: err
                })
              );
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
  createEducation(req, res, next) {
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

      educationSchema
        .validate(req.body, { abortEarly: false })
        .then(validEducation => {
          profile.education.unshift(validEducation);
          profile
            .save()
            .then(profile => {
              res.status(200).json([
                profile,
                {
                  message: "Profile education successfully saved"
                }
              ]);
            })
            .catch(err => {
              next(
                Err("Error while saving profile education", 500, {
                  dbAsyncError: err
                })
              );
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
  updateExperience(req, res, next) {
    experienceSchema
      .validate(req.body, { abortEarly: false })
      .then(validExperience => {
        Profile.findOneAndUpdate(
          { user: req.user.id, "experience._id": req.params.exp_id },
          { "experience.$": validExperience },
          { new: true },
          (err, profile) => {
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
            res.status(200).json([
              profile,
              {
                message: "Profile experience successfully updated"
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
  },
  updateEducation(req, res, next) {
    educationSchema
      .validate(req.body, { abortEarly: false })
      .then(validEducation => {
        Profile.findOneAndUpdate(
          { user: req.user.id, "education._id": req.params.exp_id },
          { "education.$": validEducation },
          { new: true },
          (err, profile) => {
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
            res.status(200).json([
              profile,
              {
                message: "Profile education successfully updated"
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
  },
  deleteExperience(req, res, next) {
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

      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);
      profile.experience.splice(removeIndex, 1);

      profile
        .save()
        .then(profile => {
          res.status(200).json([
            profile,
            {
              message: "Profile experience successfully deleted"
            }
          ]);
        })
        .catch(err => {
          next(
            Err("Error while deleting profile experience", 500, {
              dbAsyncError: err
            })
          );
        });
    });
  },
  deleteEducation(req, res, next) {
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

      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id);
      profile.education.splice(removeIndex, 1);

      profile
        .save()
        .then(profile => {
          res.status(200).json([
            profile,
            {
              message: "Profile education successfully deleted"
            }
          ]);
        })
        .catch(err => {
          next(
            Err("Error while deleting profile education", 500, {
              dbAsyncError: err
            })
          );
        });
    });
  }
};
