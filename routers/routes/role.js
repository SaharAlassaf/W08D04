const express = require("express");
const { create, roles } = require("../controllers/role");
const authentication = require("./../middlewares/authentication");
const authorization = require("./../middlewares/authorization");

const roleRouter = express.Router();

roleRouter.post("/create", authentication, authorization, create);
roleRouter.get("/roles", authentication, authorization, roles);

module.exports = roleRouter;
