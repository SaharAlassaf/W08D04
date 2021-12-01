const mongoose = require("mongoose");
require("dotenv").config();

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.DB, options, () => {
  try {
    console.log("DB READY TO USE");
  } catch (error) {
    console.error(error);
  }
});