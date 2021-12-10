const userModel = require("./../../db/models/user");

const checkDuplicate = (req, res, next) => {
  const { email, username } = req.body;

  // Username
  const savedUsername = username.toLowerCase();

  userModel
    .findOne({
      username: savedUsername,
    })
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res
          .status(400)
          .send({ message: "Failed! Username is already in use!" });
        return;
      }

      // Email
      const savedEmail = email.toLowerCase();
      userModel
        .findOne({
          email: savedEmail,
        })
        .exec((err, user) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          if (user) {
            res
              .status(400)
              .json({ message: "Failed! Email is already in use!" });
            return;
          }

          next();
        });
    });
};

module.exports = checkDuplicate;
