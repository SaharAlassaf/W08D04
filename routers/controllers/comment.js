const postModel = require("./../../db/models/post");
const userModel = require("./../../db/models/user");
const comModel = require("./../../db/models/comment");

// add comment to post
const addComment = (req, res) => {
  const { postId } = req.params;
  const { comment } = req.body;

  console.log(postId, comment);

  postModel
    .findOne({ postId, isDel: false })
    .then((result) => {
      if (result) {
        const newCom = new comModel({
          comment,
          user: req.token.id,
          // dosen't saved!
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

//Show all comments for Admin
const comments = (req, res) => {
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

//Update comment
const editComment = (req, res) => {
  const { comId } = req.params; //postId
  const { comment } = req.body;

  comModel
    .findOneAndUpdate(
      { _id: comId, user: req.token.id /* ,post: postId*/ },
      { comment },
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

const deleteComment = (req, res) => {
  const { comId } = req.params;

  comModel
    .findOneAndUpdate(
      { _id: comId, user: req.token.id, isDel: false },
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

module.exports = {
  addComment,
  comments,
  editComment,
  deleteComment,
};
