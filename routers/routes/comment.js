const express = require("express");
const {
  addComment,
  comments,
  getCom,
  editComment,
  deleteComment,
  adminDeleteComment
} = require("../controllers/comment");
const authentication = require("./../middlewares/authentication");
const authorization = require("./../middlewares/authorization");
const exist = require("./../middlewares/exist");

const commentRouter = express.Router();

commentRouter.get("/comments", authentication, exist, comments);
commentRouter.get("/getCom/:id", authentication, exist, getCom);
commentRouter.post("/addComment/:postId", authentication, exist, addComment);
commentRouter.put(
  "/editComment/:postId/:comId",
  authentication,
  exist,
  editComment
);
commentRouter.delete(
  "/deleteComment/:postId/:comId",
  authentication,
  exist,
  deleteComment
);
commentRouter.delete(
  "/adminDeleteComment/:postId/:comId",
  authentication,
  authorization,
  adminDeleteComment
);  //just Admin

module.exports = commentRouter;
