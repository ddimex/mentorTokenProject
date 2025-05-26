const Startup = require("../pkg/db/users/startupSchema");

exports.getAllStartups = async (req, res) => {
  try {
    const startups = await Startup.find().populate("jobsPosted");

    res.status(200).json({
      status: "success",
      data: { startups },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getOneStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id).populate("jobsPosted");

    res.status(200).json({
      status: "success",
      data: { startup },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getLoggedInStartup = async (req, res) => {
  try {
    if (!req.auth || !req.auth.id) {
      return res
        .status(401)
        .json({ status: "fail", message: "Unauthorized, no user data" });
    }

    const startup = await Startup.findById(req.auth.id);

    if (!startup) {
      return res.status(404).json({
        status: "fail",
        message: "Startup not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: { startup },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createStartup = async (req, res) => {
  try {
    const newStartup = await Startup.create(req.body);

    res.status(200).json({
      status: "success",
      data: { newStartup },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateStartup = async (req, res) => {
  try {
    const updates = {};

    if (req.body.startupName) updates.startupName = req.body.startupName;
    if (req.body.phone) updates.phone = req.body.phone;
    if (req.body.address) updates.address = req.body.address;
    if (req.body.skills) updates.skills = req.body.skills;
    if (req.body.bio) updates.bio = req.body.bio;
    if (req.file) updates.profilePicture = req.file.path;

    const updatedStartup = await Startup.findByIdAndUpdate(
      req.auth.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: { updatedStartup },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteStartup = async (req, res) => {
  try {
    await Startup.findByIdAndDelete(req.params.id);

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
