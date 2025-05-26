const Job = require("../pkg/db/jobs/jobSchema");
const Startup = require("../pkg/db/users/startupSchema");

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "open" }).populate("startupId");

    res.status(200).json({
      status: "success",
      data: { jobs },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getMyJobs = async (req, res) => {
  try {
    if (!req.auth || !req.auth.id) {
      return res.status(401).json({ status: "fail", message: "Unauthorized" });
    }

    const jobs = await Job.find({
      startupId: req.auth.id,
      status: "open",
    }).populate("startupId");

    res.status(200).json({
      status: "success",
      data: { jobs },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getOneJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("startupId");

    res.status(200).json({
      status: "success",
      data: { job },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createJob = async (req, res) => {
  try {
    const newJob = await Job.create({
      startupId: req.auth.id,
      title: req.body.title,
      description: req.body.description,
      skillsRequired: req.body.skillsRequired,
      status: req.body.status,
    });

    await Startup.findByIdAndUpdate(req.auth.id, {
      $push: { jobsPosted: newJob._id },
    });

    res.status(200).json({
      status: "success",
      data: { newJob },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: { updatedJob },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
