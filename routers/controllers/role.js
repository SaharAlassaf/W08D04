const rolerModel = require("./../../db/models/role");

const create = (req, res) => {
  const { role, permission } = req.body;

  const newRole = new rolerModel({
    role,
    permission,
  });

  newRole
    .save()
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

const roles = (req, res) => {
  rolerModel
    .find({})
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
};

module.exports = { create, roles };
