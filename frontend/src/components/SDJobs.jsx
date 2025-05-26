import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardHeader from "./DashboardHeader";
import DashboardMenu from "./DashboardMenu";
import StartupPopup from "./StartupPopup";
import NewJob from "./NewJob";

const SDJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const [mentorApplications, setMentorApplications] = useState([]);
  const [popup, setPopup] = useState(false);
  const [creatingJob, setCreatingJob] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  const fetchJobs = () => {
    axios
      .get("http://localhost:10000/startupDashboard/jobs", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setJobs(res.data.data.jobs || []);
      })
      .catch(() => {
        setJobs([]);
      });
  };

  useEffect(() => {
    fetchJobs();

    axios
      .get("http://localhost:10000/startupDashboard/applications/pending", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const grouped = res.data.data.reduce((acc, app) => {
          const jobId = app.jobId._id;
          if (!acc[jobId]) acc[jobId] = [];
          acc[jobId].push(app);
          return acc;
        }, {});
        setMentorApplications(grouped);
      })
      .catch(() => setMentorApplications({}));
  }, []);

  const handleViewMoreClick = (job) => {
    setActiveJob(job);
    setPopup(true);

    axios
      .get(`http://localhost:10000/jobApplications/${job._id}?status=pending`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const newApps = res.data.data || [];

        const grouped = newApps.reduce((acc, app) => {
          const jobId = app.jobId._id;
          if (!acc[jobId]) acc[jobId] = [];
          acc[jobId].push(app);
          return acc;
        }, {});

        setMentorApplications((prev) => ({
          ...prev,
          ...grouped,
        }));
      })
      .catch(() => {
        setMentorApplications([]);
      });
  };

  const handleCreateNewJob = () => {
    setCreatingJob(true);
  };

  const handleAddJob = (newJob) => {
    setJobs((prevJobs) => [...prevJobs, newJob]);
    setSearchResults(null);
  };

  return (
    <div className="dashboard">
      <div className="dashboard flexRow">
        <DashboardMenu />

        <div className="dashboardContainer flexCol">
          <DashboardHeader
            searchResults={searchResults}
            setSearchResults={setSearchResults}
          />

          <div className="mentorsContainer flexCol">
            <div
              className="flexRow alignCenter spaceBetween"
              style={{ width: "94%" }}
            >
              <h4 className="dashboardTitle">Your Startup Jobs</h4>

              <button
                className="acceptBtn flexRow alignCenter"
                style={{ gap: "10px" }}
                onClick={handleCreateNewJob}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.3795 6.35467H8.10173V1.0769C8.10173 0.59046 7.70765 0.197266 7.2221 0.197266C6.73654 0.197266 6.34247 0.59046 6.34247 1.0769V6.35467H1.06469C0.579133 6.35467 0.185059 6.74787 0.185059 7.2343C0.185059 7.72074 0.579133 8.11393 1.06469 8.11393H6.34247V13.3917C6.34247 13.8781 6.73654 14.2713 7.2221 14.2713C7.70765 14.2713 8.10173 13.8781 8.10173 13.3917V8.11393H13.3795C13.8651 8.11393 14.2591 7.72074 14.2591 7.2343C14.2591 6.74787 13.8651 6.35467 13.3795 6.35467Z"
                    fill="white"
                  />
                </svg>
                <p>Create New Job</p>
              </button>
            </div>

            <div className="jobCardContainer flexRow">
              {(() => {
                const displayJobs =
                  searchResults?.jobs?.length > 0 ? searchResults.jobs : jobs;

                return displayJobs.length > 0 ? (
                  displayJobs.map((job) => (
                    <div
                      key={job._id}
                      style={{ position: "relative" }}
                      className="jobCardLarge flexCol alignCenter"
                    >
                      <div className="flexRow alignCenter">
                        {job.startupId?.profilePicture ? (
                          <img
                            src={`http://localhost:10000/${job.startupId.profilePicture}`}
                            className="pfp"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/img/startupDefault.png";
                            }}
                          />
                        ) : (
                          <img src="/img/startupDefault.png" className="pfp" />
                        )}

                        <h4 className="font userCardText">
                          {job.startupId?.startupName || "Unknown Startup"}
                        </h4>
                      </div>

                      <h4 className="font jobCardTitle">{job.title}</h4>
                      <h4 className="font jobCardSubtitle">
                        {job.description}
                      </h4>

                      <div
                        className="flexRow alignCenter spaceBetween"
                        style={{
                          height: "50px",
                          width: "90%",
                          position: "absolute",
                          bottom: "10px",
                          left: "12px",
                        }}
                      >
                        <div className="flexCol alignCenter">
                          <div className="mentorPfpRow flexRow alignCenter">
                            {Array.isArray(mentorApplications[job._id]) &&
                              mentorApplications[job._id].map((app) => (
                                <img
                                  key={app._id}
                                  src={`http://localhost:10000/${app.mentorId.profilePicture}`}
                                  className="pfpXS"
                                  title={app.mentorId.fullName}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/img/mentorDefault.png";
                                  }}
                                />
                              ))}
                          </div>

                          {Array.isArray(mentorApplications[job._id]) && (
                            <p
                              className="font jobCardSubtitle"
                              style={{ fontSize: "12px" }}
                            >
                              {mentorApplications[job._id].length > 3
                                ? "3+ Applicants"
                                : `${
                                    mentorApplications[job._id].length
                                  } Applicant${
                                    mentorApplications[job._id].length !== 1
                                      ? "s"
                                      : ""
                                  }`}
                            </p>
                          )}
                        </div>

                        <button
                          className="acceptBtn"
                          onClick={() => handleViewMoreClick(job)}
                        >
                          View More
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    className="jobCardSmall applicationInfoContainer flexRow alignCenter justifyCenter"
                    style={{ width: "90.5%" }}
                  >
                    <p className="loginTitle">No jobs available yet</p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {popup && activeJob && (
        <StartupPopup
          job={{
            ...activeJob,
            applications: mentorApplications[activeJob._id] || [],
          }}
          updateApplications={(jobId, updatedApps) => {
            setMentorApplications((prev) => ({
              ...prev,
              [jobId]: updatedApps,
            }));
          }}
          onClose={() => {
            setPopup(false);
            setActiveJob(null);
          }}
        />
      )}

      {creatingJob && (
        <NewJob
          setCreatingJob={setCreatingJob}
          onCancel={() => setCreatingJob(false)}
          addJobToList={handleAddJob}
          fetchJobs={fetchJobs}
        />
      )}
    </div>
  );
};

export default SDJobs;
