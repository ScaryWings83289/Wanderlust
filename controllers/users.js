const User = require("../models/user");
const Tour = require("../models/tours");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

// SHOW REGISTER FORM
module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

// HANDLE SIGN UP LOGIC
module.exports.register = async (req, res, next) => {
  try {
    const {
      email,
      username,
      password,
      firstName,
      lastName,
      avatar,
      description,
    } = req.body;
    const user = new User({
      email,
      username,
      firstName,
      lastName,
      avatar,
      description,
    });
    user.avatar = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    if (req.body.adminCode === "secretcode123") {
      user.isAdmin = true;
    }
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/tours");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

// SHOW LOGIN FORM
module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

// HANDLE LOGIN LOGIC
module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = req.session.returnTo || "/tours";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

// HANDLE LOGOUT LOGIC
module.exports.logout = (req, res) => {
  // req.logout();
  req.session.destroy();
  req.flash("success", "Goodbye!");
  res.redirect("/tours");
};

// SHOW FORGOT PASSWORD FORM
module.exports.renderForgot = (req, res) => {
  res.render("users/forgot");
};

// HANDLE FORGOT PASSWORD LOGIC
module.exports.forgot = (req, res, next) => {
  async.waterfall(
    [
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString("hex");
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne({ email: req.body.email }, function (err, user) {
          if (!user) {
            req.flash("error", "No account with that email address exists.");
            return res.redirect("/forgot");
          }
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
          user.save(function (err) {
            done(err, token, user);
          });
        });
      },
      function (token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "lucifer2686@gmail.com",
            pass: process.env.GMAILPW,
          },
        });
        // var smtpTransport = nodemailer.createTransport({
        //   host: process.env.EMAIL_HOST,
        //   port: process.env.EMAIL_PORT,
        //   auth: {
        //     user: process.env.EMAIL_USERNAME,
        //     pass: process.env.EMAIL_PASSWORD,
        //   },
        // });
        var mailOptions = {
          to: user.email,
          from: "lucifer2686@gmail.com",
          subject: "Wanderlust Password Reset",
          text:
            "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
            "http://" +
            req.headers.host +
            "/reset/" +
            token +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n",
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          console.log("mail sent");
          req.flash(
            "success",
            "An e-mail has been sent to " +
              user.email +
              " with further instructions."
          );
          done(err, "done");
        });
      },
    ],
    function (err) {
      if (err) return next(err);
      res.redirect("/forgot");
    }
  );
};

// SHOW RESET PASSWORD FORM
module.exports.renderReset = (req, res) => {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    },
    function (err, user) {
      if (!user) {
        req.flash("error", "Password reset token is invalid or has expired.");
        return res.redirect("/forgot");
      }
      res.render("reset", { token: req.params.token });
    }
  );
};

// HANDLE RESET PASSWORD LOGIC
module.exports.reset = (req, res) => {
  async.waterfall(
    [
      function (done) {
        User.findOne(
          {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
          },
          function (err, user) {
            if (!user) {
              req.flash(
                "error",
                "Password reset token is invalid or has expired."
              );
              return res.redirect("back");
            }
            if (req.body.password === req.body.confirm) {
              user.setPassword(req.body.password, function (err) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                user.save(function (err) {
                  req.logIn(user, function (err) {
                    done(err, user);
                  });
                });
              });
            } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect("back");
            }
          }
        );
      },
      function (user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "lucifer2686@gmail.com",
            pass: process.env.GMAILPW,
          },
        });
        // var smtpTransport = nodemailer.createTransport({
        //   host: process.env.EMAIL_HOST,
        //   port: process.env.EMAIL_PORT,
        //   auth: {
        //     user: process.env.EMAIL_USERNAME,
        //     pass: process.env.EMAIL_PASSWORD,
        //   },
        // });
        var mailOptions = {
          to: user.email,
          from: "lucifer2686@gmail.com",
          subject: "Your password has been changed",
          text:
            "Hello,\n\n" +
            "This is a confirmation that the password for your account " +
            user.email +
            " has just been changed.\n",
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          req.flash("success", "Success! Your password has been changed.");
          done(err);
        });
      },
    ],
    function (err) {
      res.redirect("/tours");
    }
  );
};

// SHOW DASHBOARD OF A USER
module.exports.renderUser = (req, res) => {
  User.findById(req.params.id, function (err, foundUser) {
    if (err) {
      req.flash("error", "Something went wrong.");
      return res.redirect("/");
    }
    Tour.find()
      .where("author")
      .equals(foundUser._id)
      .exec(function (err, tours) {
        if (err) {
          req.flash("error", "Something went wrong.");
          return res.redirect("/");
        }
        res.render("users/show", { user: foundUser, tours: tours });
      });
  });
};
