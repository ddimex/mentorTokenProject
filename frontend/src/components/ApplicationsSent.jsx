import React, { useEffect, useState } from "react";
import axios from "axios";

const ApplicationsSent = () => {
  const role = localStorage.getItem("role");
  const isStartup = role === "startup";
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:10000/mentorApplicationsSent",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setApplications(response.data.data || []);
      } catch (error) {
        console.error(
          "Error fetching applications:",
          error.response?.data || error.message
        );
      }
    };

    fetchApplications();
  }, []);

  return (
    <div
      style={
        isStartup
          ? { height: "400px" }
          : { height: "360px", width: "500px", marginRight: "100px" }
      }
      className="bestMentorsMenu flexCol assignedJobsContainer"
    >
      <h3 className="dashboardTitle">Applications Sent</h3>
      <p
        className="font filterTab"
        style={{ padding: "0px", cursor: "default" }}
      >
        Jobs you have applied to
      </p>

      <div className="menuContainer">
        {applications.length > 0 ? (
          applications.map((app) => (
            <div
              key={app._id}
              className="jobCardSmall flexRow alignCenter spaceBetween"
            >
              <div className="flexRow alignCenter">
                <img
                  src={`http://localhost:10000/${app.startupId.profilePicture}`}
                  className="pfpSmall"
                />
                <div className="flexCol" style={{ marginLeft: "20px" }}>
                  <p className="font">{app.startupId.startupName}</p>
                  <h4 className="font">{app.jobId.title}</h4>
                </div>
              </div>

              <div className="applicationBtnContainer flexRow alignCenter">
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 19 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_37_292)">
                    <path
                      d="M9.50004 17.4163C13.8723 17.4163 17.4167 13.8719 17.4167 9.49967C17.4167 5.12742 13.8723 1.58301 9.50004 1.58301C5.12779 1.58301 1.58337 5.12742 1.58337 9.49967C1.58337 13.8719 5.12779 17.4163 9.50004 17.4163Z"
                      stroke="#EEEAFC"
                      strokeWidth="1.58333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.5 4.75V9.5L12.6667 11.0833"
                      stroke="#EEEAFC"
                      strokeWidth="1.58333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_37_292">
                      <rect width="19" height="19" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
          ))
        ) : (
          <div className="jobCardSmall applicationInfoContainer flexRow alignCenter justifyCenter">
            <p className="loginTitle">No pending applications.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsSent;
