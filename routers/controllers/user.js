const userModel = require("./../../db/models/user");
const postModel = require("./../../db/models/post");
const comModel = require("./../../db/models/comment");
const likeModel = require("./../../db/models/like");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.secretKey;

const mailgun = require("mailgun-js");
const DOMAIN = "sandbox093b95b4aa3d4d5abdba1595e7d10442.mailgun.org";
const mg = mailgun({ apiKey: process.env.api_key, domain: DOMAIN });

// sign up
const signup = async (req, res) => {
  const { email, username, password } = req.body;

  const savedEmail = email.toLowerCase();
  const savedUsername = username.toLowerCase();
  const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));

  const payload = {
    email: savedEmail,
    username: savedUsername,
    password: hashedPassword,
  };
  const options = { expiresIn: "1h" };
  const token = await jwt.sign(payload, secret, options);

  const data = {
    from: "norelay@myFirstEmail.com",
    to: savedEmail,
    subject: `Hi ${savedUsername}, please verify your account‏‏`,
    html: `<h2>Account Verification</h2>
    <a href="${process.env.URL}/auth/${token}">Verify your email address</a>
    `,
  };
  mg.messages().send(data, (error) => {
    if (error) {
      res.status(400).send(error);
    } else {
      res.status(200).send("Email have been sent");
    }
  });
};

const activateAccount = (req, res) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        res.status(400).send("Incorrect or expired link");
      } else {
        const { email, username, password } = decodedToken;
        userModel
          .findOne({ email })
          .then((result) => {
            if (result) {
              res.status(400).send("Email is already in use!");
            } else {
              const newUser = new userModel({
                email,
                username,
                password,
              });
              newUser
                .save()
                .then((result) => {
                  res.status(200).send("Signup successfully✅");
                })
                .catch((err) => {
                  // console.log(err);
                  res.status(400).send(err);
                });
            }
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      }
    });
  } else {
    res.status(400).send("Somthing went wrong!");
  }
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
      res.status(200).send(result);
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
            res.status(200).send("Deleted successfully✅");
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      } else {
        res.status(400).send("Already deleted");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

module.exports = { signup, activateAccount, signin, users, deleteUser };
