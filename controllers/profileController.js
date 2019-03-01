const Profile = require("../models/profileModel");
const profileRequest = require("../requests/profileRequest");
const profileSchema = profileRequest.profileSchema;

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
              profile: "Error querying profile"
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
                    profile: "Error while updating profile"
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
                  profile: "Error while creating profile"
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
                      profile: "Error while saving profile"
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
  update(req, res, next) {
    res.send("Index");
  },
  delete(req, res, next) {
    res.send("Index");
  }
};
