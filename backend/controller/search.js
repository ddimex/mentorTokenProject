const Mentor = require("../pkg/db/users/mentorSchema");
const Job = require("../pkg/db/jobs/jobSchema");

exports.searchMentors = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query term is required" });
    }

    const mentors = await Mentor.find({
      mentorName: { $regex: query, $options: "i" },
    });

    return res.json({ data: mentors });
  } catch (error) {
    console.error("Error searching mentors:", error);
    res
      .status(500)
      .json({ message: "Error searching mentors", error: error.message });
  }
};

exports.searchMyJobs = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query term is required" });
    }

    const jobs = await Job.find({
      startupId: req.auth.id,
      status: "open",
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    }).populate("startupId", "startupName profilePicture");

    return res.json({ data: jobs });
  } catch (error) {
    console.error("Error searching jobs:", error);
    res
      .status(500)
      .json({ message: "Error searching jobs", error: error.message });
  }
};

exports.searchJobs = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query term is required" });
    }

    const jobs = await Job.find({
      status: "open",
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    }).populate("startupId", "startupName profilePicture");

    return res.json({ data: jobs });
  } catch (error) {
    console.error("Error searching jobs:", error);
    res
      .status(500)
      .json({ message: "Error searching jobs", error: error.message });
  }
};
