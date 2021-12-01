const express = require("express");
const {
  addComment,
  comments,
  editComment,
  deleteComment,
} = require("../controllers/comment");
const authentication = require("./../middlewares/authentication");
const authorization = require("./../middlewares/authorization");
const exist = require("./../middlewares/exist");

const commentRouter = express.Router();

commentRouter.get("/comments", authentication, authorization, comments); //just Admin
commentRouter.post("/addComment/:id", authentication, exist, addComment);
commentRouter.put("/editComment/:comId", authentication, exist, editComment);
commentRouter.delete("/deleteComment/:comId", authentication,  exist,  deleteComment);

module.exports = commentRouter;
