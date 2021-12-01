const express = require("express");
const { createPost } = require("../controllers/post");
const authentication = require("./../middlewares/authentication");
const authorization = require("./../middlewares/authorization");
const exist = require("./../middlewares/exist");

const postRouter = express.Router();

postRouter.post("/createPost", authentication, exist, createPost);

module.exports = postRouter;
