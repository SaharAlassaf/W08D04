const userModel = require("./../../db/models/user");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
require("dotenv").config();

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

const signin = (req, res) => {
  const { emailORusername, password } = req.body;

  const savedEmailORusername = emailORusername.toLowerCase();

  userModel
    .findOne({ $or: [{ email: savedEmailORusername }, { username: savedEmailORusername }] })
    .then(async (result) => {
      if (result) {
        console.log(result.username);
        if (result.email == savedEmailORusername || result.username == savedEmailORusername) {
          const checkedPassword = await bcrypt.compare(
            password,
            result.password
          );
          if (checkedPassword) {
            const payload = {
              id: result._id,
              role: result.role,
              isDel: result.result,
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

const users = (req, res) => {
  userModel
    .find({ isDel: { $eq: false } })
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

const deleteUser = (req, res) => {
  const { id } = req.params;

  userModel
    .findByIdAndDelete(id)
    .then((result) => {
      if (result) {
        res.status(201).send(result);
      } else {
        res.status(404).send("User already deleted");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

module.exports = { signup, signin, users, deleteUser };
