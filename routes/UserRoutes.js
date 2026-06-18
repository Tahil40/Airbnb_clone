const express = require("express");
const router = express.Router();
const UserSchema = require("../models/user.js");
const passport = require("passport");

router.get("/sign-up", (req, res) => {
  res.render("user/SignUp.ejs");
});

router.post("/sign-up", async (req, res) => {
  const { username, email, password } = req.body;
  const register_user = new UserSchema({
    email: email,
    username,
  });

  const response = await UserSchema.register(register_user, password);
  res.send(response);
});

router.get("/login", async (req, res) => {
  res.render("user/Login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    res.send("Welcome To Airbnb You Are Logged In!");
    // res.redirect("/listings");
  },
);

module.exports = router;