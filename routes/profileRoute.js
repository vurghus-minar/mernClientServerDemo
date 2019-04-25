const passport = require("passport");
const profileController = require("../controllers/profileController");

module.exports = app => {
  // Profile routes
  app.get(
    "/profile",
    passport.authenticate("jwt", { session: false }),
    profileController.index
  );

  // Get profile by handle
  app.get("/profile/handle/:handle", profileController.getProfileByHandle);

  // Get profile by user id
  app.get("/profile/user/:user_id", profileController.getProfileByUserId);

  // Get all profiles
  app.get("/profiles", profileController.getAllProfiles);

  // Create or update profile
  app.post(
    "/profile",
    passport.authenticate("jwt", { session: false }),
    profileController.create
  );

  // Create experience in profile
  app.post(
    "/profile/experience",
    passport.authenticate("jwt", { session: false }),
    profileController.createExperience
  );

  // Create education in profile
  app.post(
    "/profile/education",
    passport.authenticate("jwt", { session: false }),
    profileController.createEducation
  );

  // Update experience in profile
  app.put(
    "/profile/experience/:exp_id",
    passport.authenticate("jwt", { session: false }),
    profileController.updateExperience
  );

  // Update education in profile
  app.put(
    "/profile/education/:exp_id",
    passport.authenticate("jwt", { session: false }),
    profileController.updateEducation
  );

  app.delete(
    "/profile/experience/:exp_id",
    passport.authenticate("jwt", { session: false }),
    profileController.deleteExperience
  );

  app.delete(
    "/profile/education/:edu_id",
    passport.authenticate("jwt", { session: false }),
    profileController.deleteEducation
  );
};
