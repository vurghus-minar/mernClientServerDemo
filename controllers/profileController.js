const Profile = require("../models/profileModel");
require("../models/userModel");
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
        return res.status(500).json({
          profile: "Error while querying user profile",
          error: err
        });
      }
      if (!profile) {
        return res.status(404).json({
          profile: "No profile exists"
        });
      }

      res.json(profile);
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
                profile: "No profile exists"
              });
            }
            res.json(profile);
          })
          .catch(err => {
            return res.status(500).json({
              handle: "Error fetching user profile",
              error: err
            });
          });
      })
      .catch(validationError => {
        const errorMessage = validationError.details.map(d => d.message);
        res.status(422).send(errorMessage);
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
                profile: "No profile exists"
              });
            }
            res.json(profile);
          })
          .catch(err => {
            return res.status(500).json({
              user_id: "Error fetching user profile",
              error: err
            });
          });
      })
      .catch(validationError => {
        const errorMessage = validationError.details.map(d => d.message);
        res.status(422).send(errorMessage);
      });
  },
  getAllProfiles(req, res, next) {
    Profile.find()
      .populate("user", ["name", "avatar"])
      .exec()
      .then(profiles => {
        if (!profiles) {
          return res.status(404).json({
            profiles: "No profiles exists"
          });
        }
        res.json(profiles);
      })
      .catch(err => {
        return res.status(500).json({
          profiles: "Error fetching profiles",
          error: err
        });
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
            return res.status(500).json({
              profile: "Error querying profile",
              error: err
            });
          }
          if (profile) {
            //Update
            Profile.findOneAndUpdate(
              { user: req.user.id },
              { $set: validProfile },
              { new: true },
              (err, profile) => {
                if (err) {
                  return res.status(500).json({
                    profile: "Error while updating profile",
                    error: err
                  });
                }
                res.json([
                  profile,
                  { message: "Profile successfully updates" }
                ]);
              }
            );
          } else {
            //create
            //check if handle exists
            Profile.findOne({ handle: validProfile.handle }, (err, profile) => {
              if (err) {
                return res.status(500).json({
                  profile: "Error while creating profile",
                  error: err
                });
              }
              if (profile) {
                errors.handle = "The handle already exist";
                res.status(400).json(errrs);
              }
              new Profile(validProfile)
                .save()
                .then(profile => {
                  res.json([
                    profile,
                    {
                      message: "Profile successfully saved"
                    }
                  ]);
                })
                .catch(err => {
                  return res.status(500).json([
                    err,
                    {
                      profile: "Error while saving profile",
                      error: err
                    }
                  ]);
                });
            });
          }
        });
      })
      .catch(validationError => {
        const errorMessage = validationError.details.map(d => d.message);
        res.status(422).send(errorMessage);
      });
  },
  createExperience(req, res, next) {
    Profile.findOne({ user: req.user.id }, (err, profile) => {
      if (err) {
        return res.status(500).json({
          user: "Error while fetching user profile",
          error: err
        });
      }

      if (!profile) {
        return res.status(404).json({
          profile: "No profile exists"
        });
      }

      experienceSchema
        .validate(req.body, { abortEarly: false })
        .then(validExperience => {
          profile.experience.unshift(validExperience);
          profile
            .save()
            .then(profile => {
              res.json([
                profile,
                {
                  message: "Profile experience successfully saved"
                }
              ]);
            })
            .catch(err => {
              return res.status(500).json([
                err,
                {
                  experience: "Error while saving profile experience",
                  error: err
                }
              ]);
            });
        })
        .catch(validationError => {
          const errorMessage = validationError.details.map(d => d.message);
          res.status(422).send(errorMessage);
        });
    });
  },
  createEducation(req, res, next) {
    Profile.findOne({ user: req.user.id }, (err, profile) => {
      if (err) {
        return res.status(500).json({
          user: "Error while fetching user profile",
          error: err
        });
      }

      if (!profile) {
        return res.status(404).json({
          profile: "No profile exists"
        });
      }

      educationSchema
        .validate(req.body, { abortEarly: false })
        .then(validEducation => {
          profile.education.unshift(validEducation);
          profile
            .save()
            .then(profile => {
              res.json([
                profile,
                {
                  message: "Profile education successfully saved"
                }
              ]);
            })
            .catch(err => {
              return res.status(500).json([
                err,
                {
                  education: "Error while saving profile education",
                  error: err
                }
              ]);
            });
        })
        .catch(validationError => {
          const errorMessage = validationError.details.map(d => d.message);
          res.status(422).send(errorMessage);
        });
    });
  },
  updateExperience(req, res, next) {
    Profile.findOne({ user: req.user.id }, (err, profile) => {
      if (err) {
        return res.status(500).json({
          user: "Error while fetching user profile",
          error: err
        });
      }

      if (!profile) {
        return res.status(404).json({
          profile: "No profile exists"
        });
      }

      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);
      profile.experience.splice(removeIndex, 1);

      profile
        .save()
        .then(profile => {
          res.json([
            profile,
            {
              message: "Profile experience successfully deleted"
            }
          ]);
        })
        .catch(err => {
          return res.status(500).json([
            err,
            {
              experience: "Error while saving profile experience",
              error: err
            }
          ]);
        });
    });
  },
  updateEducation(req, res, next) {},
  deleteExperience(req, res, next) {
    Profile.findOne({ user: req.user.id }, (err, profile) => {
      if (err) {
        return res.status(500).json({
          user: "Error while fetching user profile",
          error: err
        });
      }

      if (!profile) {
        return res.status(404).json({
          profile: "No profile exists"
        });
      }

      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);
      profile.experience.splice(removeIndex, 1);

      profile
        .save()
        .then(profile => {
          res.json([
            profile,
            {
              message: "Profile experience successfully deleted"
            }
          ]);
        })
        .catch(err => {
          return res.status(500).json([
            err,
            {
              experience: "Error while saving profile experience",
              error: err
            }
          ]);
        });
    });
  },
  deleteEducation(req, res, next) {
    Profile.findOne({ user: req.user.id }, (err, profile) => {
      if (err) {
        return res.status(500).json({
          user: "Error while fetching user profile",
          error: err
        });
      }

      if (!profile) {
        return res.status(404).json({
          profile: "No profile exists"
        });
      }

      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id);
      profile.education.splice(removeIndex, 1);

      profile
        .save()
        .then(profile => {
          res.json([
            profile,
            {
              message: "Profile education successfully deleted"
            }
          ]);
        })
        .catch(err => {
          return res.status(500).json([
            err,
            {
              education: "Error while saving profile education",
              error: err
            }
          ]);
        });
    });
  }
};
