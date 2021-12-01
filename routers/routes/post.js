const express = require("express");
const { createPost,posts, userPost, getPost, updatePost, deletePost, like } = require("../controllers/post");
const authentication = require("./../middlewares/authentication");
const authorization = require("./../middlewares/authorization");
const exist = require("./../middlewares/exist");

const postRouter = express.Router();

postRouter.post("/createPost", authentication, exist, createPost);
postRouter.get("/", authentication,authorization, posts); // just Admin
postRouter.get("/userPost", authentication, exist, userPost);
postRouter.get("/getPost", authentication, exist, getPost);

postRouter.put("/updatePost/:id", authentication, exist, updatePost);
postRouter.delete("/deletePost/:id", authentication, exist, deletePost);
postRouter.delete("/like/:id", authentication, exist, like);

module.exports = postRouter;
