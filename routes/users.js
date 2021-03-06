const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const users = require("../controllers/users");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/register")
  .get(users.renderRegister)
  .post(upload.array("avatar"), catchAsync(users.register));

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

router.get("/users/:id", users.renderUser);

module.exports = router;
