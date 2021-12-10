const express = require("express");
const {
  signup,
  activateAccount,
  forgotPassword,
  resetPassword,
  signin,
  users,
  deleteUser,
} = require("../controllers/user");
const authentication = require("./../middlewares/authentication");
const authorization = require("./../middlewares/authorization");
const checkDuplicate = require("./../middlewares/checkDuplicate");

const userRouter = express.Router();

userRouter.get("/users", authentication, authorization, users); //just Admin
userRouter.post("/signup", checkDuplicate, signup);
userRouter.post("/activateAccount", activateAccount);
userRouter.put("/forgotPassword", forgotPassword);
userRouter.put("/resetPassword", resetPassword);
userRouter.post("/signin", signin);
userRouter.delete("/deleteUser/:id", authentication, authorization, deleteUser); //just Admin

module.exports = userRouter;
