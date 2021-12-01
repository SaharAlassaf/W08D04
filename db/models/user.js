const mongoose = require("mongoose");

var validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    required: "Email address is required",
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],

    trim: true,
  },
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 8, trim: true },
  avatar: {
    type: String,
    default:
      "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg",
  },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  isDel: { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model("User", userSchema);
