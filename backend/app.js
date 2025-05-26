const express = require("express");
const db = require("./pkg/db/index");
const cookieParser = require("cookie-parser");
const jwt = require("express-jwt");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const authHandler = require("./controller/authHandler");
const startup = require("./controller/startup");
const mentor = require("./controller/mentor");
const job = require("./controller/job");
const application = require("./controller/application");
const search = require("./controller/search");
const overview = require("./controller/overview");

const app = express();

app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.use(express.static(path.join(__dirname, "../frontend/img")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

db.init();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.post(
  "/registerStartup",
  upload.single("profilePicture"),
  authHandler.registerStartup
);
app.post(
  "/registerMentor",
  upload.single("profilePicture"),
  authHandler.registerMentor
);
app.post("/login", authHandler.login);

app.post("/sendContactMessage", authHandler.sendMessage);
app.post("/forgotPassword", authHandler.forgotPassword);
app.post("/resetPassword/:token", authHandler.resetPassword);

app.use(
  jwt
    .expressjwt({
      algorithms: ["HS256"],
      secret: process.env.JWT_SECRET,
      getToken: (req) => {
        if (
          req.headers.authorization &&
          req.headers.authorization.startsWith("Bearer ")
        ) {
          return req.headers.authorization.split(" ")[1];
        }
        if (req.cookies.jwt) {
          return req.cookies.jwt;
        }
        return null;
      },
    })
    .unless((req) => {
      const openPaths = [
        "/",
        "/about",
        "/contact",
        "/sendContactMessage",
        "/registerStartup",
        "/registerMentor",
        "/login",
        "/forgotPassword",
      ];
      if (openPaths.includes(req.path)) return true;
      if (req.path.startsWith("/resetPassword/")) return true;
      return false;
    })
);

app.get("/startups", startup.getAllStartups);
app.get("/startups/:id", startup.getOneStartup);
app.get("/startupDashboard", startup.getLoggedInStartup);
app.patch(
  "/startupDashboard",
  upload.single("profilePicture"),
  startup.updateStartup
);
app.get(
  "/startupDashboard/mentors",
  mentor.getAllMentors,
  startup.getLoggedInStartup
);
app.get(
  "/startupDashboard/mentors/:id",
  mentor.getOneMentor,
  startup.getLoggedInStartup
);
app.get(
  "/startupDashboard/mentorApplications/:id",
  application.getAcceptedJobsByMentorForStartup
);
app.get("/startupToMentorPending/:id", application.getStartupToMentorPending);
app.get(
  "/startupDashboard/jobs",
  job.getMyJobs,
  application.getApplicationsByJob,
  startup.getLoggedInStartup
);

app.get("/startupApplicationsSent", application.getStartupApplicationsSent);
app.get(
  "/startupDashboard/applications/received",
  application.getStartupApplicationsReceived
);
app.get(
  "/startupDashboard/applications/pending",
  application.getStartupPendingApplicationsReceived
);

app.get("/mentorDashboard", mentor.getLoggedInMentor);
app.get("/mentorApplicationsSent", application.getMentorApplicationsSent);
app.get(
  "/mentorApplicationsReceived",
  application.getMentorApplicationsReceived
);
app.get(
  "/mentorDashboard/myStats",
  mentor.getLoggedInMentor,
  mentor.getOneMentor
);
app.patch(
  "/mentorDashboard/myStats",
  upload.single("profilePicture"),
  mentor.updateMentor
);
app.get("/mentorDashboard/jobFeed", mentor.getLoggedInMentor);

app.get(
  "/mentorDashboard/applications/sent",
  application.getMentorApplicationsSent
);

app.get("/jobs", job.getAllJobs);
app.get("/myJobs", job.getMyJobs);
app.get("/jobs/:id", job.getOneJob);
app.post("/createJob", job.createJob);

app.get("/applicationsTest", application.getAllApplications);
app.get("/applications", application.getApplicationsByJob);
app.post("/applications", application.createApplication);
app.post(
  "/startupToMentorApplication",
  application.createStartupToMentorApplication
);
app.get("/applications/:id", application.getOneApplication);
app.get("/acceptedMentorApplications", application.getAcceptedMentorJobs);
app.get("/acceptedStartupApplications", application.getAcceptedStartupJobs);

app.get("/bestMentors", application.getBestMentors);

app.get("/jobApplications/:id", application.getApplicationsByJob);
app.patch("/updateApplicationStatus", application.updateApplicationStatus);
app.patch("/updateAcceptedStatus", application.updateAcceptedStatus);

app.get("/startupOverview", overview.getStartupOverview);
app.get("/mentorOverview", overview.getMentorOverview);

app.get("/mentorChart", overview.getMentorChartData);
app.get("/startupChart", overview.getStartupChartData);

app.delete("/applications/:id", application.deleteApplication);

app.get("/mentorRating/:mentorId", application.getMentorRating);

app.get("/searchMentors", search.searchMentors);
app.get("/searchMyJobs", search.searchMyJobs);
app.get("/searchJobs", search.searchJobs);

app.listen(10000, (err) => {
  if (err) return console.log("There is an error");
  console.log("Server started successfully on port 10000");
});
