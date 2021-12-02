const userModel = require("./../../db/models/user");
const postModel = require("./../../db/models/post");
const comModel = require("./../../db/models/comment");
const likeModel = require("./../../db/models/like");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
require("dotenv").config();

// sign up
const signup = async (req, res) => {
  const { email, username, password, avatar, role } = req.body;

  const savedEmail = email.toLowerCase();
  const savedUsername = username.toLowerCase();
  const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));

  const newUser = new userModel({
    email: savedEmail,
    username: savedUsername,
    password: hashedPassword,
    avatar,
    role,
  });

  newUser
    .save()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
};

// sign in
const signin = (req, res) => {
  const { emailORusername, password } = req.body;

  const savedEmailORusername = emailORusername.toLowerCase();

  userModel
    .findOne({
      $or: [
        { email: savedEmailORusername },
        { username: savedEmailORusername },
      ],
    })
    .then(async (result) => {
      if (result) {
        console.log(result.username);
        if (
          result.email == savedEmailORusername ||
          result.username == savedEmailORusername
        ) {
          const checkedPassword = await bcrypt.compare(
            password,
            result.password
          );
          if (checkedPassword) {
            const payload = {
              id: result._id,
              role: result.role,
              isDel: result.isDel,
            };
            const options = { expiresIn: "1h" };
            const secret = process.env.secretKey;
            const token = await jwt.sign(payload, secret, options);
            res.status(200).send({ result, token });
          } else {
            res.status(404).send("Invalid email or password");
          }
        } else {
          res.status(404).send("Invalid email or password");
        }
      } else {
        res.status(404).send("User doesn't exist");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

// show all users for Admin
const users = (req, res) => {
  userModel
    .find({ isDel: false })
    .populate("role")
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

// delete users for Admin
const deleteUser = (req, res) => {
  const { id } = req.params;

  userModel
    .findOneAndUpdate({ _id: id, isDel: false }, { isDel: true }, { new: true })
    .exec()
    .then((result) => {
      if (result) {
        postModel
          .updateMany({ user: id }, { $set: { isDel: true } })
          .catch((err) => {
            res.status(400).send(err);
          });
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

module.exports = { signup, signin, users, deleteUser };
