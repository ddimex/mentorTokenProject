const Application = require("../pkg/db/jobs/applicationSchema");
const Mentor = require("../pkg/db/users/mentorSchema");
const moment = require("moment");

exports.getStartupOverview = async (req, res) => {
  try {
    const startupId = req.auth.id;

    const totalMentors = await Mentor.countDocuments();

    const assignedJobs = await Application.find({
      startupId,
      status: "accepted",
    });

    const totalAssignedJobs = assignedJobs.length;
    const totalFinishedJobs = assignedJobs.filter(
      (app) => app.acceptedStatus === "done"
    ).length;

    res.status(200).json({
      totalMentors,
      totalAssignedJobs,
      totalFinishedJobs,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMentorOverview = async (req, res) => {
  try {
    const mentorId = req.auth.id;

    const applications = await Application.find({ mentorId });

    const totalJobs = applications.filter(
      (app) => app.status === "accepted"
    ).length;
    const totalMentorToStartupJobs = applications.filter(
      (app) =>
        app.applicationType === "mentorToStartup" && app.status === "accepted"
    ).length;
    const totalStartupToMentorJobs = applications.filter(
      (app) =>
        app.applicationType === "startupToMentor" && app.status === "accepted"
    ).length;
    const totalFinishedJobs = applications.filter(
      (app) => app.acceptedStatus === "done"
    ).length;

    const allJobs = applications.filter((app) => app.status === "accepted");

    res.status(200).json({
      totalJobs,
      totalMentorToStartupJobs,
      totalStartupToMentorJobs,
      totalFinishedJobs,
      allJobs,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStartupChartData = async (req, res) => {
  try {
    const startupId = req.auth.id;

    const applications = await Application.find({ startupId });

    const acceptedApplications = applications.filter(
      (app) => app.status === "accepted"
    );

    const start = moment().month("November").subtract(1, "years");
    const end = moment().month("October");

    const monthsRange = [];
    const monthlyJobs = {};

    let current = start.clone();
    while (current.isSameOrBefore(end, "month")) {
      const key = current.format("YYYY-MM");
      monthsRange.push(key);
      monthlyJobs[key] = 0;
      current.add(1, "month");
    }

    acceptedApplications.forEach((app) => {
      const month = moment(app.acceptedAt).format("YYYY-MM");
      if (monthlyJobs[month] !== undefined) {
        monthlyJobs[month] += 1;
      }
    });

    const months = monthsRange;
    const jobCounts = months.map((month) => monthlyJobs[month]);

    res.status(200).json({
      months,
      jobCounts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMentorChartData = async (req, res) => {
  try {
    const mentorId = req.auth.id;

    const applications = await Application.find({ mentorId });

    const acceptedApplications = applications.filter(
      (app) => app.status === "accepted"
    );

    const start = moment().month("November").subtract(1, "years");
    const end = moment().month("October");

    const monthsRange = [];
    const monthlyJobs = {};

    let current = start.clone();
    while (current.isSameOrBefore(end, "month")) {
      const key = current.format("YYYY-MM");
      monthsRange.push(key);
      monthlyJobs[key] = 0;
      current.add(1, "month");
    }

    acceptedApplications.forEach((app) => {
      const month = moment(app.acceptedAt).format("YYYY-MM");
      if (monthlyJobs[month] !== undefined) {
        monthlyJobs[month] += 1;
      }
    });

    const months = monthsRange;
    const jobCounts = months.map((month) => monthlyJobs[month]);

    res.status(200).json({
      months,
      jobCounts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};