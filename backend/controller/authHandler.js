const Startup = require("../pkg/db/users/startupSchema");
const Mentor = require("../pkg/db/users/mentorSchema");
const bcrypt = require("bcryptjs");
const email = require("../pkg/mail/email");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

exports.registerStartup = async (req, res) => {
  try {
    const newStartup = await Startup.create({
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      password: req.body.password,
      startupName: req.body.startupName,
      profilePicture: req.file ? req.file.path : null,
    });

    res.status(201).json({
      status: "success",
      data: { startup: newStartup },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.registerMentor = async (req, res) => {
  try {
    const newMentor = await Mentor.create({
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      password: req.body.password,
      mentorName: req.body.mentorName,
      profilePicture: req.file ? req.file.path : null,
    });

    res.status(201).json({
      status: "success",
      data: { mentor: newMentor },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Please provide an email and password");
    }

    let user = await Startup.findOne({ email });
    if (!user) {
      user = await Mentor.findOne({ email });
    }
    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid email or password");
    }

    const payload = {
      id: user._id,
      startupName: user.startupName,
      mentorName: user.mentorName,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    res.cookie("jwt", token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      secure: false,
      httpOnly: true,
    });

    res.status(200).json({
      status: "success",
      token,
      user: {
        id: user._id,
        role: user.role,
        mentorId: user.role === "mentor" ? user._id : null,
        startupId: user.role === "startup" ? user._id : null,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    let user = await Startup.findOne({ email: req.body.email });
    let name = "";

    if (!user) {
      user = await Mentor.findOne({ email: req.body.email });
      if (user) {
        name = user.mentorName;
      }
    } else {
      name = user.startupName;
    }

    if (!user) {
      return res.status(404).send("This user does not exist");
    }
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = Date.now() + 30 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const resetUrl = `http://localhost:5173/resetPassword/${resetToken}`;

    const message = `Hi ${name},\n\nYou requested a password reset. Please use the following link to reset your password (valid for 30 minutes):\n\n${resetUrl}\n\nIf you didn’t request this, you can safely ignore this email.`;

    await email.sendMail({
      email: user.email,
      subject: "Your password reset token (Valid for 30 minutes)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Password reset link sent successfully!",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const token = req.params.token;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    let user = await Startup.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      user = await Mentor.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
      });
    }

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found, token has expired",
      });
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res
      .status(200)
      .json({ status: "success", message: "Password reset successfully!" });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    await email.sendMessage(req.body);
    res.status(200).send({ message: "Message sent successfully!" });
  } catch (err) {
    console.error("Error sending contact message:", err);
    res.status(500).send({ error: "Failed to send contact message." });
  }
};
