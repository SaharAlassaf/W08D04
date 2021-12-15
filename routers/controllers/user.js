const userModel = require("./../../db/models/user");
const postModel = require("./../../db/models/post");
const comModel = require("./../../db/models/comment");
const likeModel = require("./../../db/models/like");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();
const secret = process.env.secretKey;

const clinte = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
    <a href="${process.env.URL}/activateAccount">Verify your email address</a>
    `,
  };
  mg.messages().send(data, (error) => {
    if (error) {
      console.log(error);
      res.status(400).send(error);
    } else {
      res.status(200).send({ token });
    }
  });
};

// activate account
const activateAccount = (req, res) => {
  const { token } = req.body;
  console.log(token);
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

// forgot password
const forgotPassword = (req, res) => {
  const { email } = req.body;

  const savedEmail = email.toLowerCase();

  userModel
    .findOne({ email: savedEmail })
    .then(async (result) => {
      const payload = {
        _id: result._id,
        email: savedEmail,
      };
      const options = { expiresIn: "1h" };
      const token = await jwt.sign(payload, secret, options);

      const data = {
        from: "norelay@myFirstEmail.com",
        to: savedEmail,
        subject: "Reset Passwoed",
        html: `<h2>Reset Password</h2>
        <a href="${process.env.URL}/resetPassword">Reset your password</a>
        `,
      };
      userModel
        .findOneAndUpdate({ email: savedEmail }, { resetLink: token })
        .then(() => {
          mg.messages().send(data, (error) => {
            if (error) {
              res.status(400).send(error);
            } else {
              res.status(200).send({ token });
            }
          });
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

// reset password
const resetPassword = async (req, res) => {
  const { resetLink, newPass } = req.body;

  const hashedPassword = await bcrypt.hash(newPass, Number(process.env.SALT));

  if (resetLink) {
    jwt.verify(resetLink, secret, (err) => {
      if (err) {
        res.status(401).send("Incorrect or expired link");
      } else {
        userModel
          .findOne({ resetLink })
          .then((result) => {
            if (result) {
              userModel
                .findOneAndUpdate(
                  { resetLink },
                  { password: hashedPassword, resetLink: "" }
                )
                .then(() => {
                  res.status(200).send("Reset successfully✅");
                })
                .catch((err) => {
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
    res.status(401).send("Authentication error");
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
    }).populate("role")
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
            return res.status(404).send("Invalid email or password");
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

// sign in with google
const googleSignin = (req, res) => {
  const { token } = req.body;

  clinte
    .verifyIdToken({
      idToken: token,
      audience:
        "303299576143-aiehfsg7l0jrm7313aav0smgh11g150h.apps.googleusercontent.com",
    })
    .then((response) => {
      const { email_verified, email, name, given_name } = response.payload;
      if (email_verified) {
        userModel.findOne({ email: email }).exec(async (err, user) => {
          if (err) {
            res.status(400).send("Somthing went wrong!");
          } else {
            if (user) {
              const payload = {
                id: user._id,
                role: user.role,
                isDel: user.isDel,
              };
              const options = { expiresIn: "1h" };
              const token = await jwt.sign(payload, secret, options);
              res.status(200).send({ user, token });
            } else {
              let password = email + process.env.secretKey;
              const hashedPassword = await bcrypt.hash(
                password,
                Number(process.env.SALT)
              );
              const newUser = new userModel({
                email,
                username: given_name,
                password: hashedPassword,
              });
              newUser
                .save()
                .then(async (result) => {
                  const payload = {
                    id: result._id,
                    role: result.role,
                    isDel: result.isDel,
                  };
                  const options = { expiresIn: "1h" };
                  const token = await jwt.sign(payload, secret, options);
                  res.status(200).send({ result, token });
                })
                .catch((err) => {
                  // console.log(err);
                  res.status(400).send(err);
                });
            }
          }
        });
      }
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

module.exports = {
  signup,
  activateAccount,
  forgotPassword,
  resetPassword,
  signin,
  googleSignin,
  users,
  deleteUser,
};
