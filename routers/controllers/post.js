const postModel = require("./../../db/models/post");

const post = (req, res) => {
  if (!req.token.isDel) {
    const { img, desc, user } = req.body;

    const newPost = new postModel({
      img,
      desc,
      user: req.token.id,
    });

    newPost
      .save()
      .then((result) => {
        res.status(201).send(result);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }
};

module.exports = {
    post,
  };