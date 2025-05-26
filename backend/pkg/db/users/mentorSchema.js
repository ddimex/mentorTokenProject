const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const mentorSchema = new mongoose.Schema({
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
    default: "./img/mentorDefault.png",
  },
  mentorName: {
    type: String,
    required: [true, "Mentor name is required"],
  },
  phone: {
    type: String,
    unique: true,
    required: [true, "Phone number is required"],
  },
  address: {
    type: String,
    // required: [true, "Address is required"],
  },
  role: {
    type: String,
    enum: ["mentor", "startup"],
    default: "mentor",
  },
  acceptedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  skills: [
    {
      type: String,
    },
  ],
  bio: {
    type: String,
  },
  passwordResetToken: {
    type: String,
    required: false,
  },
  passwordResetExpires: {
    type: Date,
    required: false,
  },
});

mentorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Mentor = mongoose.model("Mentor", mentorSchema);
module.exports = Mentor;
