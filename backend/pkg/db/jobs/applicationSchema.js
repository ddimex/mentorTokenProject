const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  startupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Startup",
    required: true,
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mentor",
    required: true,
  },
  applicationType: {
    type: String,
    enum: ["mentorToStartup", "startupToMentor"],
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  acceptedStatus: {
    type: String,
    enum: ["done", "inProgress"],
    default: "inProgress",
  },
  acceptedAt: {
    type: Date,
    default: Date.now,
  },
});

applicationSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await mongoose.model("Job").findByIdAndDelete(doc.jobId);
  }
});

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;
