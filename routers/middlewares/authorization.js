const rolerModel = require("./../../db/models/role");

const authorization = async (req, res, next) => {
  try {
    const roleId = req.token.role;

    const result = await rolerModel.findById(roleId);

    if (result.role === "admin") {
      next();
    } else {
      return res.status(403).send({ message: "forbidden" });
    }
  } catch (error) {
    res.status(403).send(error);
  }
};

module.exports = authorization;
