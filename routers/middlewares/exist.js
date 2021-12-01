const exist = async (req, res, next) => {
  try {
    if (!req.token.isDel) {
      next();
    } else {
      return res.status(404).send({ message: "forbidden" });
    }
  } catch (error) {
    res.status(403).send(error);
  }
};

module.exports = exist;
