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

//Show all posts for Admin
const posts = (req, res) => {
  postModel
    .find({ isDel: false })
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
        res.status(201).send(result);
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
        res.status(404).send("Task is not exist");
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
        res.status(201).send("Deleted successfully✅");
        // res.status(201).send(result);
      } else {
        // if not the creator or allready deleted
        res.status(404).send("Failed deleted⚠️");
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
            { isLiked: !ruselt.isLiked  }
          ).then((updateResult) => {
            res.status(201).send(updateResult);
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
  // .exec()
  // .then((result) => {
  //   if (result) {
  //     // res.status(201).send("liked successfully✅");
  //     res.status(201).send(result);
  //   } else {
  //     const likePost = new likeModel({
  //       post: postId,
  //       user: req.token.id,
  //     });

  //     likePost
  //       .save()
  //       .then(() => {
  //         res.status(201).send(result);
  //         // res.status(201).send("liked successfully✅");
  //       })
  //       .catch((err) => {
  //         res.status(400).send(err);
  //       });
  //   }
  // })
};

module.exports = {
  createPost,
  posts,
  getPost,
  userPost,
  updatePost,
  deletePost,
  like,
};
