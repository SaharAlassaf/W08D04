const express = require("express");
const {
  addComment,
  comments,
  getCom,
  editComment,
  deleteComment,
} = require("../controllers/comment");
const authentication = require("./../middlewares/authentication");
const authorization = require("./../middlewares/authorization");
const exist = require("./../middlewares/exist");

const commentRouter = express.Router();

commentRouter.get("/comments", authentication, authorization, comments); //just Admin
commentRouter.get("/getCom/:id", authentication, authorization, getCom); //just Admin
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

module.exports = commentRouter;
