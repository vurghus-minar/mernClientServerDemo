const User = require("../models/userModel");
const Err = require("../utils/error");
const userRequest = require("../requests/userRequest");
const registerUserSchema = userRequest.registerUserSchema;
const loginUserSchema = userRequest.loginUserSchema;
const gravatar = require("gravatar");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

// Get configuration
const config = require("../config");

module.exports = {
  register(req, res, next) {
    registerUserSchema
      .validate(req.body, { abortEarly: false })
      .then(validUser => {
        User.findOne({ email: validUser.email }, (err, user) => {
          if (err) {
            next(
              Err("Error while querying email", 500, {
                dbCallbackError: err
              })
            );
          }
          if (user) {
            return res.status(400).json({
              message: "Email already exists"
            });
          } else {
            const avatar = gravatar.url(validUser.email, {
              s: "200",
              r: "pg",
              d: "mm"
            });

            const newUser = new User({
              name: validUser.name,
              email: validUser.email,
              avatar,
              password: validUser.password
            });

            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) {
                  next(
                    Err("Password Error!", 500, {
                      bcryptCallbackError: err
                    })
                  );
                }
                newUser.password = hash;
                console.log(newUser);
                newUser
                  .save()
                  .then(user => {
                    res.status(200).json(user);
                  })
                  .catch(err => {
                    next(
                      Err("Error creating new user", 500, {
                        userRegistrationError: err
                      })
                    );
                  });
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
  login(req, res, next) {
    loginUserSchema
      .validate(req.body, { abortEarly: false })
      .then(validUser => {
        //check if user exists
        User.findOne({ email: validUser.email }, (err, user) => {
          if (err) {
            next(Err("Error logging in!", 500, { dbCallbackError: err }));
          }
          if (!user) {
            return res.status(404).json({
              message: "User not found"
            });
          }
          //check password match
          bcrypt
            .compare(validUser.password, user.password)
            .then(isMatch => {
              if (isMatch) {
                //User matched
                const payload = {
                  id: user.id,
                  name: user.name,
                  avatar: user.avatar
                };
                //Sign JSON Web Token
                jwt.sign(
                  payload,
                  config.jwt.key,
                  {
                    expiresIn: config.jwt.expiry
                  },
                  (err, token) => {
                    if (err) {
                      next(
                        Err("Error getting user token", 500, {
                          jwtCallbackError: err
                        })
                      );
                    }
                    res.status(200).json({
                      success: true,
                      token: "Bearer " + token
                    });
                  }
                );
              } else {
                return res.status(401).json({
                  message: "Incorrect password"
                });
              }
            })
            .catch(err => {
              next(
                Err("Error verifying user password", 500, {
                  userLoginError: err
                })
              );
            });
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
  }
};
