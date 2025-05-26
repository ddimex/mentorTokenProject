const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const startupSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  profilePicture: {
    type: String,
    default: "./img/startupDefault.png",
  },
  startupName: {
    type: String,
    required: [true, "Startup name is required"],
  },
  legalRepresentative: {
    type: String,
  },
  registeredBusinessAddress: {
    type: String,
  },
  role: {
    type: String,
    enum: ["mentor", "startup"],
    default: "startup",
  },
  jobsPosted: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  passwordResetToken: {
    type: String,
    required: false,
  },
  passwordResetExpires: {
    type: Date,
    required: false,
  },
});

startupSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Startup = mongoose.model("Startup", startupSchema);
module.exports = Startup;
