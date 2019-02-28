const User = require("../models/userModel");

const userRequest = require("../requests/userRequest");
const registerUserSchema = userRequest.registerUserSchema;
const loginUserSchema = userRequest.loginUserSchema;
const gravatar = require("gravatar");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

// Get configuration
const config = require("../config");

module.exports = {
  profile(req, res, next) {
    const user = req.user;
    res.json({
      name: user.name,
      email: user.email,
      avatar: user.avatar
    });
  },
  register(req, res, next) {
    registerUserSchema
      .validate(req.body, { abortEarly: false })
      .then(validUser => {
        User.findOne({ email: validUser.email }, (err, user) => {
          if (err) {
            return res.status(500).json({
              email: "Error while querying email"
            });
          }
          if (user) {
            return res.status(400).json({
              email: "Email already exists"
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
                if (err) throw err;
                newUser.password = hash;
                console.log(newUser);
                newUser
                  .save()
                  .then(user => {
                    res.json(user);
                  })
                  .catch(err => {
                    res.status(500).send(err);
                  });
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
  login(req, res, next) {
    loginUserSchema
      .validate(req.body, { abortEarly: false })
      .then(validUser => {
        //check if user exists
        User.findOne({ email: validUser.email }, (err, user) => {
          if (err) {
            return res.status(500).json({
              email: "Error while logging in"
            });
          }
          if (!user) {
            return res.status(404).json({
              email: "User not found"
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
                    res.json({
                      success: true,
                      token: "Bearer " + token
                    });
                  }
                );
              } else {
                return res.status(401).json({
                  password: "Incorrect password"
                });
              }
            })
            .catch(err => {
              return res.status(500).json({
                password: "Error checking password"
              });
            });
        });
      })
      .catch(validationError => {
        const errorMessage = validationError.details.map(d => d.message);
        res.status(422).send(errorMessage);
      });
  }
};
