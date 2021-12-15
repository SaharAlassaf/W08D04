const postModel = require("./../../db/models/post");
const comModel = require("./../../db/models/comment");

// add comment to post
const addComment = (req, res) => {
  const { postId } = req.params;
  const { comment } = req.body;

  postModel
    .find({ _id: postId, isDel: false })
    .then((result) => {
      if (result) {
        const newCom = new comModel({
          comment,
          user: req.token.id,
          post: postId,
        });
        newCom
          .save()
          .then(() => {
            res.status(201).send("Posted successfully✅");
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      } else {
        // if post deleted
        res.status(404).send("Failed⚠️");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

// show all comments
const comments = (req, res) => {
  comModel
    .find({ isDel: false })
    .populate("user")
    .then((result) => {
      if (result.length > 0) {
        res.status(200).send(result);
      } else {
        res.status(404).send("No comments");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

// show post by id
const getCom = (req, res) => {
  const { id } = req.params;
  comModel
    .findById(id)
    .populate("user")
    .then((result) => {
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(404).send("Comment is not exist");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

// Update comment
const editComment = (req, res) => {
  const { postId, comId } = req.params;
  const { comment } = req.body;

  comModel
    .findOneAndUpdate(
      { _id: comId, user: req.token.id, post: postId },
      { comment },
      { new: true }
    )
    .exec()
    .then((result) => {
      console.log(result);
      if (result) {
        res.status(200).send("Updated successfully✅");
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

// Delete comment
const deleteComment = (req, res) => {
  const { postId, comId } = req.params;

  comModel
    .findOneAndUpdate(
      { _id: comId, user: req.token.id, post: postId, isDel: false },
      { isDel: true },
      { new: true }
    )
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).send("Deleted successfully✅");
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

// admin delete comment
const adminDeleteComment = (req, res) => {
  const { postId, comId } = req.params;

  comModel
    .findOneAndUpdate(
      { _id: comId, post: postId, isDel: false },
      { isDel: true },
      { new: true }
    )
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).send("Deleted successfully✅");
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

module.exports = {
  addComment,
  comments,
  getCom,
  editComment,
  deleteComment,
  adminDeleteComment,
};
