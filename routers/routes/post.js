const express = require("express");
const { post } = require("../controllers/post");
const authentication = require("./../middlewares/authentication");
const authorization = require("./../middlewares/authorization");

const postRouter = express.Router();

postRouter.post("/post", authentication, post);

module.exports = postRouter;
