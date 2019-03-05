const Joi = require("joi");

const useridSchema = Joi.string();

const handleSchema = Joi.string();
const companySchema = Joi.string();
const websiteSchema = Joi.string();
const locationSchema = Joi.string();
const statusSchema = Joi.string();
const skillsSchema = Joi.string();
const bioSchema = Joi.string();
const githubusernameSchema = Joi.string();

//Experience nested
const experienceTitleSchema = Joi.string();
const experienceCompanySchema = Joi.string();
const experienceLocationSchema = Joi.string();
const experienceFromSchema = Joi.date();
const experienceToSchema = Joi.date();
const experienceCurrentSchema = Joi.boolean();
const experienceDescriptionSchema = Joi.string();

//Education nested
const educationSchoolSchema = Joi.string();
const educationDegreeSchema = Joi.string();
const educationFieldOfStudySchema = Joi.string();
const educationFromSchema = Joi.date();
const educationToSchema = Joi.date();
const educationCurrentSchema = Joi.boolean();
const educationDescriptionSchema = Joi.string();

//Social nested
const socialYoutubeSchema = Joi.string()
  .uri()
  .trim();
const socialTwitterSchema = Joi.string()
  .uri()
  .trim();
const socialFacebookSchema = Joi.string()
  .uri()
  .trim();
const socialLinkedinSchema = Joi.string()
  .uri()
  .trim();
const socialInstagramSchema = Joi.string()
  .uri()
  .trim();

const educationSchema = Joi.object().keys({
  school: educationSchoolSchema.required(),
  degree: educationDegreeSchema.required(),
  fieldofstudy: educationFieldOfStudySchema,
  from: educationFromSchema.required(),
  to: educationToSchema,
  current: educationCurrentSchema,
  description: educationDescriptionSchema
});
exports.educationSchema = educationSchema;

const experienceSchema = Joi.object().keys({
  title: experienceTitleSchema.required(),
  company: experienceCompanySchema.required(),
  location: experienceLocationSchema,
  from: experienceFromSchema.required(),
  to: experienceToSchema,
  current: experienceCurrentSchema,
  description: experienceDescriptionSchema
});
exports.experienceSchema = experienceSchema;

const socialSchema = Joi.object().keys({
  youtube: socialYoutubeSchema,
  twitter: socialTwitterSchema,
  facebook: socialFacebookSchema,
  linkedin: socialLinkedinSchema,
  instagram: socialInstagramSchema
});
exports.socialSchema = socialSchema;

//Profile Schemas

exports.profileSchema = Joi.object().keys({
  handle: handleSchema.required(),
  company: companySchema,
  website: websiteSchema,
  location: locationSchema,
  status: statusSchema.required(),
  skills: skillsSchema.required(),
  bio: bioSchema,
  githubusername: githubusernameSchema,
  experience: Joi.array().items(experienceSchema),
  education: Joi.array().items(educationSchema),
  social: socialSchema
});

exports.profileHandleSchema = Joi.object().keys({
  handle: handleSchema.required()
});

exports.profileUserIdSchema = Joi.object().keys({
  user_id: useridSchema.required()
});
