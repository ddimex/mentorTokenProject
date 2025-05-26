const Mentor = require("../pkg/db/users/mentorSchema");

exports.getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find().populate("acceptedJobs");

    res.status(200).json({
      status: "success",
      data: { mentors },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getOneMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id).populate("acceptedJobs");

    res.status(200).json({
      status: "success",
      data: { mentor },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getLoggedInMentor = async (req, res) => {
    try {
        if (!req.auth || !req.auth.id) {
            return res.status(401).json({ status: "fail", message: "Unauthorized, no user data" });
        }

      const mentor = await Mentor.findById(req.auth.id);
  
      if (!mentor) {
        return res.status(404).json({
            status: "fail",
            message: "Mentor not found",
        });
    }

      res.status(200).json({
        status: "success",
        data: { mentor },
      });
    } catch (err) {
      res.status(500).json({
        status: "fail",
        message: err.message,
      });
    }
  };

exports.createMentor = async (req, res) => {
  try {
    const newMentor = await Mentor.create(req.body);

    res.status(200).json({
      status: "success",
      data: { newMentor },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateMentor = async (req, res) => {
  try {
    const allowedUpdates = {
      mentorName: req.body.mentorName,
      phone: req.body.phone,
      address: req.body.address,
      skills: req.body.skills,
      bio: req.body.bio,
    };

    if (req.file) {
      allowedUpdates.profilePicture = req.file.path;
    }

    const updatedMentor = await Mentor.findByIdAndUpdate(
      req.auth.id,
      allowedUpdates,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: { updatedMentor },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteMentor = async (req, res) => {
  try {
    await Mentor.findByIdAndDelete(req.params.id);

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
