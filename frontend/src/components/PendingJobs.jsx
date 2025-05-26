import React, { useEffect, useState } from "react";
import axios from "axios";

const PendingJobs = ({
  mentorId,
  applications: externalApplications = null,
  onUpdateStatus,
}) => {
  const role = localStorage.getItem("role");
  const isStartup = role === "startup";
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchPendingJobs = async () => {
      if (externalApplications) {
        setApplications(externalApplications);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:10000/startupToMentorPending/${mentorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setApplications(response.data.data || []);
      } catch (error) {
        console.error(
          "Error fetching pending jobs:",
          error.response?.data || error.message
        );
      }
    };

    fetchPendingJobs();
  }, [mentorId, externalApplications]);

  const handleUpdate = async (id, status) => {
    if (onUpdateStatus) {
      await onUpdateStatus(id, status);
      setApplications((prev) => prev.filter((app) => app._id !== id));
    }
  };

  const handleDelete = async (applicationId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.delete(
        `http://localhost:10000/applications/${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setApplications((prev) =>
          prev.filter((app) => app._id !== applicationId)
        );
      } else {
        console.error("Delete failed with status:", res.status);
      }
    } catch (err) {
      console.error(
        "Error deleting application:",
        err.response?.data || err.message
      );
    }
  };

  const validApplications = applications.filter(
    (app) => app.jobId && app.startupId
  );

  return (
    <div
      style={
        isStartup
          ? { height: "400px" }
          : { height: "360px", width: "500px", marginRight: "100px" }
      }
      className="bestMentorsMenu flexCol assignedJobsContainer"
    >
      <h3 className="dashboardTitle">Pending Jobs</h3>
      <p
        className="font filterTab"
        style={{ padding: "0px", cursor: "default" }}
      >
        Jobs offered from your startup
      </p>

      <div
        className="menuContainer"
        style={isStartup ? { height: "100%" } : {}}
      >
        {validApplications.length > 0 ? (
          validApplications.map((app) => (
            <div
              key={app._id}
              className="jobCardSmall applicationInfoContainer flexRow alignCenter spaceBetween"
              style={{ position: "relative" }}
            >
              <div className="flexRow alignCenter" style={{ width: "60%" }}>
                <img
                  src={`http://localhost:10000/${app.startupId?.profilePicture}`}
                  className="pfpSmall"
                />
                <div
                  className="flexCol"
                  style={{ maxWidth: "78%", marginLeft: "20px" }}
                >
                  <p className="font">{app.startupId?.startupName}</p>
                  <h4 className="font">{app.jobId?.title}</h4>
                </div>

                {isStartup && (
                  <button
                    className="rejectBtn"
                    style={{ position: "absolute", right: "15px" }}
                    onClick={() => handleDelete(app._id)}
                  >
                    Cancel Offer
                  </button>
                )}
              </div>

              {onUpdateStatus && (
                <div
                  className="applicationBtnContainer flexRow alignCenter spaceBetween"
                  style={{
                    width: "200px",
                    position: "absolute",
                    right: "15px",
                  }}
                >
                  <button
                    className="acceptBtn"
                    onClick={() => handleUpdate(app._id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="rejectBtn"
                    onClick={() => handleUpdate(app._id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="jobCardSmall applicationInfoContainer flexRow alignCenter justifyCenter">
            <p className="loginTitle">No offered jobs yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingJobs;
