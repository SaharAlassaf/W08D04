const postModel = require("./../../db/models/post");
const likeModel = require("./../../db/models/like");

// Posted
const createPost = (req, res) => {
  const { img, desc } = req.body;

  const newPost = new postModel({
    img,
    desc,
    user: req.token.id,
  });

  newPost
    .save()
    .then(() => {
      res.status(201).send("Posted successfully✅");
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

//Show all posts
const posts = (req, res) => {
  postModel
    .find({ isDel: false }).populate("user")
    .then((result) => {
      if (result.length > 0) {
        res.status(201).send(result);
      } else {
        res.status(404).send("No posts");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

// show user posts
const userPost = (req, res) => {
  postModel
    .find({})
    .exec()
    .then((result) => {
      if (result.length > 0) {
        res.status(200).send(result);
      } else {
        res.status(404).send("Does't have any posts");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

// show post by id
const getPost = (req, res) => {
  const { id } = req.params;
  taskModel
    .findById(id)
    .exec()
    .then((result) => {
      if (result) {
        res.status(201).send(result);
      } else {
        res.status(404).send("Post is not exist");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

// Update post
const updatePost = (req, res) => {
  const { id } = req.params;
  const { img, desc } = req.body;

  postModel
    .findOneAndUpdate(
      { _id: id, user: req.token.id },
      { img, desc },
      { new: true }
    )
    .exec()
    .then((result) => {
      console.log(result);
      if (result) {
        res.status(201).send("Updated successfully✅");
        // res.status(201).send(result);
      } else {
        // if not the creator
        res.status(404).send("Failed update⚠️");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

// Delete post
const deletePost = (req, res) => {
  const { id } = req.params;

  postModel
    .findOneAndUpdate(
      { _id: id, user: req.token.id, isDel: false },
      { isDel: true },
      { new: true }
    )
    .exec()
    .then((result) => {
      if (result) {
        comModel
          .updateMany({ user: id }, { $set: { isDel: true } })
          .catch((err) => {
            res.status(400).send(err);
          });
        likeModel
          .updateMany({ user: id }, { $set: { isLiked: false } })
          .then(() => {
            res.status(201).send("Deleted successfully✅");
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      } else {
        res.status(404).send("Already deleted");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

// admin delete post
const adminDeletePost = (req, res) => {
  const { id } = req.params;

  postModel
    .findOneAndUpdate({ _id: id, isDel: false }, { isDel: true }, { new: true })
    .exec()
    .then((result) => {
      if (result) {
        comModel
          .updateMany({ user: id }, { $set: { isDel: true } })
          .catch((err) => {
            res.status(400).send(err);
          });
        likeModel
          .updateMany({ user: id }, { $set: { isLiked: false } })
          .then(() => {
            res.status(201).send("Deleted successfully✅");
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      } else {
        res.status(404).send("Already deleted");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

// like post
const like = (req, res) => {
  const { postId } = req.params;

  likeModel
    .findOne({ post: postId, user: req.token.id })
    .then((ruselt) => {
      if (ruselt) {
        likeModel
          .findOneAndUpdate(
            { post: postId, user: req.token.id },
            { isLiked: !ruselt.isLiked }
          )
          .then((updateResult) => {
            res.status(201).send(updateResult);
            // res.status(201).send("liked successfully✅");
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      } else {
        const likePost = new likeModel({
          post: postId,
          user: req.token.id,
        });

        likePost
          .save()
          .then((newResult) => {
            res.status(201).send(newResult);
            // res.status(201).send("liked successfully✅");
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

module.exports = {
  createPost,
  posts,
  getPost,
  userPost,
  updatePost,
  deletePost,
  adminDeletePost,
  like,
};
