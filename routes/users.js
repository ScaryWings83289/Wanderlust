const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const users = require("../controllers/users");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.get("/logout", users.logout);

router.route("/forgot").get(users.renderForgot).post(users.forgot);

router.route("/reset/:token").get(users.renderReset).post(users.reset);

module.exports = router;
