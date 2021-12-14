const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.secretKey;

const authentication = (req, res, next) => {
  try {
    if (!req.headers.authorization)
      return res.status(403).send({ message: "auth forbidden" });

    const token = req.headers.authorization.split(" ")[1];

    const parsedToken = jwt.verify(token, secret);

    req.token = parsedToken;

    next();
  } catch (error) {
    res.status(403).send(error);
  }
};

module.exports = authentication;
