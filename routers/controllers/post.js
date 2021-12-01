const postModel = require("./../../db/models/post");

const createPost = (req, res) => {
    const { img, desc } = req.body;

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
};

module.exports = {
  createPost,
};
