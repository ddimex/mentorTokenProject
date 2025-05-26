const Application = require("../pkg/db/jobs/applicationSchema");
const mongoose = require("mongoose");
const Job = require("../pkg/db/jobs/jobSchema");

exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("jobId")
      .populate("startupId")
      .populate("mentorId");

    res.status(200).json({
      status: "success",
      data: { applications },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getOneApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("jobId")
      .populate("startupId")
      .populate("mentorId");

    res.status(200).json({
      status: "success",
      data: { application },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createApplication = async (req, res) => {
  try {
    const { mentorId, jobId } = req.body;

    const existingApplication = await Application.findOne({ mentorId, jobId, status: "pending" });

    if (existingApplication) {
      return res.status(400).json({
        status: "fail",
        message: "You have already applied to this job.",
      });
    }

    const newApplication = await Application.create(req.body);

    res.status(200).json({
      status: "success",
      data: { newApplication },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: { updatedApplication },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        status: "fail",
        message: "Application not found",
      });
    }

    await Job.findByIdAndDelete(application.jobId);

    await Application.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

///////////////////////////////////////////////////////////////////////////////////

exports.createStartupToMentorApplication = async (req, res) => {
  try {
    const newApplication = await Application.create({
      jobId: req.body.jobId,
      mentorId: req.body.mentorId,
      startupId: req.auth.id,
      applicationType: "startupToMentor",
    });

    res.status(200).json({
      status: "success",
      data: { newApplication },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getMentorApplicationsSent = async (req, res) => {
  try {
    const mentorId = req.auth.id;

    const applications = await Application.find({
      mentorId,
      applicationType: "mentorToStartup",
      status: "pending",
    })
      .populate("startupId", "startupName profilePicture")
      .populate("jobId", "title description");

    res.status(200).json({ status: "success", data: applications });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

exports.getMentorApplicationsReceived = async (req, res) => {
  try {
    const mentorId = req.auth.id;
    const applications = await Application.find({
      mentorId,
      applicationType: "startupToMentor",
      status: "pending",
    })
      .populate("startupId", "startupName profilePicture")
      .populate("jobId", "title description");

    res.status(200).json({ status: "success", data: applications });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

exports.getStartupApplicationsSent = async (req, res) => {
  try {
    const startupId = req.auth.id;
    const applications = await Application.find({
      startupId,
      applicationType: "startupToMentor",
    })
      .populate("mentorId", "mentorName profilePicture")
      .populate("startupId", "startupName profilePicture")
      .populate("jobId", "title description");

    res.status(200).json({ status: "success", data: applications });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

exports.getStartupApplicationsReceived = async (req, res) => {
  try {
    const startupId = req.auth.id;
    const applications = await Application.find({
      startupId,
      applicationType: "mentorToStartup",
    })
      .populate("mentorId jobId")
      .exec();

    res.status(200).json({ status: "success", data: applications });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

exports.getStartupPendingApplicationsReceived = async (req, res) => {
  try {
    const startupId = req.auth.id;

    const applications = await Application.find({
      startupId,
      applicationType: "mentorToStartup",
      status: "pending",
    })
      .populate("mentorId jobId")
      .exec();

    res.status(200).json({ status: "success", data: applications });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

exports.getApplicationsByJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    const applications = await Application.find({
      jobId: id,
      status: "pending",
    })
      .populate("jobId")
      .populate("startupId")
      .populate("mentorId", "mentorName profilePicture")
      .exec();

    res.status(200).json({ status: "success", data: applications });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

exports.getAcceptedMentorJobs = async (req, res) => {
  try {
    const mentorId = req.auth.id;

    const acceptedApplications = await Application.find({
      mentorId,
      status: { $in: ["accepted", "rejected"] },
    })
      .populate("jobId")
      .populate("startupId")
      .populate("mentorId", "mentorName profilePicture")
      .exec();

    res.status(200).json({ status: "success", data: acceptedApplications });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

exports.getAcceptedStartupJobs = async (req, res) => {
  try {
    const startupId = req.auth.id;

    const acceptedApplications = await Application.find({
      startupId,
      status: { $in: ["accepted", "rejected"] },
    })
      .populate("jobId")
      .populate("startupId")
      .populate("mentorId", "mentorName profilePicture")
      .exec();

    res.status(200).json({ status: "success", data: acceptedApplications });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

exports.getAcceptedJobsByMentorForStartup = async (req, res) => {
  try {
    const startupId = req.auth.id;
    const mentorId = req.params.id;

    const acceptedApplications = await Application.find({
      startupId,
      mentorId,
      status: { $in: ["accepted", "rejected"] },
    })
      .populate("jobId")
      .populate("startupId")
      .populate("mentorId", "mentorName profilePicture")
      .exec();

    res.status(200).json({ status: "success", data: acceptedApplications });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId, status } = req.body;
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ status: "success", data: application });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

exports.updateAcceptedStatus = async (req, res) => {
  try {
    const { applicationId, acceptedStatus } = req.body;
    if (!["inProgress", "done"].includes(acceptedStatus)) {
      return res.status(400).json({ message: "Invalid Accepted Status" });
    }

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { acceptedStatus },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ status: "success", data: application });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

exports.getBestMentors = async (req, res) => {
  const startupId = req.auth.id;

  try {
    let bestMentors = await Application.aggregate([
      {
        $match: {
          startupId: new mongoose.Types.ObjectId(startupId),
          acceptedStatus: "done",
        },
      },
      {
        $group: {
          _id: "$mentorId",
          completedJobs: { $sum: 1 },
        },
      },
      {
        $sort: { completedJobs: -1 },
      },
      {
        $limit: 3,
      },
      {
        $lookup: {
          from: "mentors",
          localField: "_id",
          foreignField: "_id",
          as: "mentorDetails",
        },
      },
      {
        $unwind: "$mentorDetails",
      },
      {
        $project: {
          _id: 1,
          completedJobs: 1,
          mentorDetails: 1,
        },
      },
    ]);

    if (bestMentors.length === 0) {
      bestMentors = await Application.aggregate([
        {
          $match: {
            acceptedStatus: "done",
          },
        },
        {
          $group: {
            _id: "$mentorId",
            completedJobs: { $sum: 1 },
          },
        },
        {
          $sort: { completedJobs: -1 },
        },
        {
          $limit: 3,
        },
        {
          $lookup: {
            from: "mentors",
            localField: "_id",
            foreignField: "_id",
            as: "mentorDetails",
          },
        },
        {
          $unwind: "$mentorDetails",
        },
        {
          $project: {
            _id: 1,
            completedJobs: 1,
            mentorDetails: 1,
          },
        },
      ]);
    }

    res.status(200).json(bestMentors);
  } catch (err) {
    console.error("Error getting best mentors:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getStartupToMentorPending = async (req, res) => {
  try {
    const mentorId = req.params.id;
    const startupId = req.auth.id;

    const applications = await Application.find({
      mentorId,
      startupId,
      status: "pending",
      applicationType: "startupToMentor",
    })
      .populate("jobId")
      .populate("startupId")
      .populate("mentorId", "mentorName profilePicture")
      .exec();

    res.status(200).json({ status: "success", data: applications });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

exports.getMentorRating = async (req, res) => {
  try {
    const mentorId = req.params.mentorId;

    const applications = await Application.find({
      mentorId: mentorId,
      applicationType: "mentorToStartup",
    });

    const total = applications.length;
    const accepted = applications.filter(
      (app) => app.status === "accepted"
    ).length;

    if (total === 0 || accepted === 0) {
      return res.json({ rating: 0 });
    }

    const percentage = (accepted / total) * 100;

    let stars = 0;
    if (percentage > 80) stars = 5;
    else if (percentage > 60) stars = 4;
    else if (percentage > 40) stars = 3;
    else if (percentage > 20) stars = 2;
    else stars = 1;

    res.json({ rating: stars });
  } catch (error) {
    console.error("Error in getMentorRating:", error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};