const express = require("express");
const {
  signup,
  activateAccount,
  forgotPassword,
  resetPassword,
  signin,
  googleSignin,
  users,
  deleteUser,
} = require("../controllers/user");
const authentication = require("./../middlewares/authentication");
const authorization = require("./../middlewares/authorization");
const checkDuplicate = require("./../middlewares/checkDuplicate");
const passport = require("passport");
require("../auth");

const userRouter = express.Router();

userRouter.get("/users", authentication, authorization, users); //just Admin
userRouter.post("/signup", checkDuplicate, signup);
userRouter.post("/activateAccount", activateAccount);
userRouter.put("/forgotPassword", forgotPassword);
userRouter.put("/resetPassword", resetPassword);
userRouter.post("/signin", signin);
userRouter.post("/googleSignin", googleSignin);
userRouter.delete("/deleteUser/:id", authentication, authorization, deleteUser); //just Admin

// userRouter.use(passport.initialize());
// userRouter.use(passport.session());

// userRouter.get(
//   "/auth/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//   })
// );

// userRouter.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/",
//     successRedirect: "/profile",
//     failureFlash: true,
//     successFlash: "Successfully logged in!",
//   })
// );

module.exports = userRouter;
