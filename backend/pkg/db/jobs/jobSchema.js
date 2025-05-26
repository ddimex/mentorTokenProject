const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  startupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Startup",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  skillsRequired: {
    type: [String],
    required: true,
  },
  status: {
    type: String,
    enum: ["direct", "open"],
    required: true,
  },
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;