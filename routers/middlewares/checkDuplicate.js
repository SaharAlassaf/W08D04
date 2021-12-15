const userModel = require("./../../db/models/user");

const checkDuplicate = (req, res, next) => {
  const { email, username, password } = req.body;

  const regexPassword = /^(?=(.*\d){2})(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{8,}$/;
  const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  /*
  At least 8 characters long
    2 letters
    2 digits
    1 Upper case
    1 Lower case
    1 Symbol

  ^(?=(.*\d){2})(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{8,}$
    ---------  --------------------- --------------- -----
        |               |                    |          |->match 8 or more characters
        |               |                    |->match further only if theres anything except letter or digit
        |               |->match further only if there is an upper-lower case letter
        |
        |->match further only if there are two digits anywhere
  */
  if (regexPassword.test(password) === false) {
    res.status(400).send({ message: "Invalid password, make it more complex" });
    return;
  } else if (regexEmail.test(email) === false){
    res.status(400).send({ message: "Invalid Email" });
    return;
  }
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
          .json({ message: "Failed! Username is already in use!" });
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
