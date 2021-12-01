const express = require("express");
const { signup, signin, users, deleteUser } = require("../controllers/user");
const authentication = require("./../middlewares/authentication");
const authorization = require("./../middlewares/authorization");

const userRouter = express.Router();

userRouter.get("/users", authentication, authorization, users); //just Admin
userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.delete("/deleteUser/:id", authentication, authorization, deleteUser);


module.exports = userRouter;
