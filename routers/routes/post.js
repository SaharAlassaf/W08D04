const express = require("express");
const {
  createPost,
  posts,
  userPost,
  getPost,
  updatePost,
  deletePost,
  adminDeletePost,
  like,
} = require("../controllers/post");
const authentication = require("./../middlewares/authentication");
const authorization = require("./../middlewares/authorization");
const exist = require("./../middlewares/exist");

const postRouter = express.Router();

postRouter.post("/createPost", authentication, exist, createPost);
postRouter.get("/", posts);
postRouter.get("/userPost/:id", userPost);

postRouter.get("/getPost/:id", getPost);
postRouter.put("/updatePost/:id", authentication, exist, updatePost);
postRouter.delete("/deletePost/:id", authentication, exist, deletePost);
postRouter.delete(
  "/adminDeletePost/:id",
  authentication,
  authorization,
  adminDeletePost
);
postRouter.post("/like/:id", like);

module.exports = postRouter;
