const { body, validationResult } = require("express-validator");
const async = require("async");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");
exports.login_post = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) next(err);
    if (!user) res.json({ response: "No User exits" });
    else {
      req.logIn(user, (err) => {
        if (err) next(err);
        res.json({ response: "success" });
        console.log(req.user);
      });
    }
  })(req, res, next);
};

exports.register_post = (req, res, next) => {
  User.findOne({ username: req.body.username }, (err, doc) => {
    if (err) throw err;
    if (doc) {
      console.log("Username already exists");
    }
    if (!doc) {
      const hashedPassword = bcrypt.hash(
        req.body.password,
        10,
        (err, hashedPassword) => {
          // if err, do something
          if (err) {
            next(err);
            return;
          }
          const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
          });

          newUser.save((err) => {
            if (err) {
              return next(err);
            }
            // Sucessfull
            return res.json({ response: "User saved" });
          });
        }
      );
    }
  });
};

exports.user_get = (req, res, next) => {
  res.json({ user: req.user });
};
