const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
require("./db");

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

const roleRouter = require("./routers/routes/role");
app.use(roleRouter);
const userRouter = require("./routers/routes/user");
app.use(userRouter);
const taskRouter = require("./routers/routes/task");
app.use(taskRouter);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server on ${process.env.PORT}`);
});
