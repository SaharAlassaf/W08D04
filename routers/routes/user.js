const express = require("express");
const {
  signup,
  activateAccount,
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
userRouter.post("/signin", signin);
userRouter.delete("/deleteUser/:id", authentication, authorization, deleteUser); //just Admin

module.exports = userRouter;
