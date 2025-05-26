import React, { useState } from "react";
import axios from "axios";

const AssignedJobsMenu = ({ applications, setApplications }) => {
  const role = localStorage.getItem("role");
  const isMentor = role === "mentor";

  const [editingJob, setEditingJob] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const [filter, setFilter] = useState("all");

  const filteredApplications = applications.filter((job) => {
    if (filter === "all") return true;
    if (filter === "done")
      return job.status === "accepted" && job.acceptedStatus === "done";
    if (filter === "inProgress")
      return job.status === "accepted" && job.acceptedStatus === "inProgress";
    if (filter === "rejected")
      return job.status === "rejected" && job.acceptedStatus === "inProgress";
    return true;
  });

  const handleStatusChange = async (applicationId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        "http://localhost:10000/updateAcceptedStatus",
        { applicationId, acceptedStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        const updatedApplications = applications.map((job) =>
          job._id === applicationId
            ? { ...job, acceptedStatus: newStatus }
            : job
        );

        setApplications(updatedApplications);
        setEditingJob(null);
      }
    } catch (err) {
      console.error("Error updating job status:", err);
    }
  };

  return (
    <div className="assignedJobsContainer flexCol">
      <h3 className="dashboardTitle">Assigned Jobs</h3>

      <div
        className="flexRow spaceBetween"
        style={{
          minHeight: "30px",
          width: "300px",
          borderBottom: "1.5px solid #D3D3FF",
        }}
      >
        {["all", "done", "rejected", "inProgress"].map((status) => (
          <h5
            key={status}
            className={`font filterTab ${filter === status ? "active" : ""}`}
            onClick={() => setFilter(status)}
          >
            {status === "inProgress"
              ? "In Progress"
              : status.charAt(0).toUpperCase() + status.slice(1)}
          </h5>
        ))}
      </div>

      <div className="assignedJobsMenu">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((job, index) => {
            if (!job.jobId) return null;

            return (
              <div
                key={index}
                className="jobCardSmall flexRow alignCenter spaceBetween"
              >
                <h4 className="font">{job.jobId.title}</h4>

                <div className="applicationStatusButtonsContainer flexRow justifyCenter">
                  {isMentor ? (
                    editingJob === job._id ? (
                      <div
                        className="flexCol alignCenter spaceAround"
                        style={{ width: "100%" }}
                      >
                        <div className="flexRow alignCenter spaceBetween">
                          <label className="custom-radio">
                            <input
                              type="radio"
                              name={`status-${job._id}`}
                              value="inProgress"
                              checked={newStatus === "inProgress"}
                              onChange={() => setNewStatus("inProgress")}
                            />
                            <span className="radio-mark"></span>
                            <span className="radio-label">In Progress</span>
                          </label>

                          <label className="custom-radio">
                            <input
                              type="radio"
                              name={`status-${job._id}`}
                              value="done"
                              checked={newStatus === "done"}
                              onChange={() => setNewStatus("done")}
                            />
                            <span className="radio-mark"></span>
                            <span className="radio-label">Done</span>
                          </label>
                        </div>

                        <button
                          className="acceptBtn"
                          onClick={() => handleStatusChange(job._id)}
                        >
                          Update
                        </button>
                      </div>
                    ) : job.status === "rejected" ? (
                      <button
                        style={{
                          backgroundColor: "#FFECEC",
                          color: "#D32F2F",
                          borderRadius: "15px",
                          border: "0px",
                          padding: "7.5px 25px",
                        }}
                      >
                        Rejected
                      </button>
                    ) : job.acceptedStatus === "inProgress" ? (
                      <button
                        style={{
                          backgroundColor: "#D3D3FF66",
                          color: "#696CFF",
                          borderRadius: "15px",
                          border: "0px",
                          padding: "7.5px 25px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setEditingJob(job._id);
                          setNewStatus("inProgress");
                        }}
                      >
                        In Progress
                      </button>
                    ) : job.acceptedStatus === "done" ? (
                      <button
                        style={{
                          backgroundColor: "#EBF6EB",
                          color: "#31AA27",
                          borderRadius: "15px",
                          border: "0px",
                          padding: "7.5px 25px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setEditingJob(job._id);
                          setNewStatus("done");
                        }}
                      >
                        Done
                      </button>
                    ) : (
                      <button>Unknown</button>
                    )
                  ) : (
                    <button
                      disabled
                      style={{
                        backgroundColor:
                          job.status === "rejected"
                            ? "#FFECEC"
                            : job.acceptedStatus === "inProgress"
                            ? "#D3D3FF66"
                            : "#EBF6EB",
                        color:
                          job.status === "rejected"
                            ? "#D32F2F"
                            : job.acceptedStatus === "inProgress"
                            ? "#696CFF"
                            : "#31AA27",
                        borderRadius: "15px",
                        border: "0px",
                        padding: "7.5px 25px",
                        textTransform: "uppercase",
                      }}
                    >
                      {job.status === "rejected"
                        ? "Rejected"
                        : job.acceptedStatus === "inProgress"
                        ? "In Progress"
                        : "Done"}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="jobCardSmall applicationInfoContainer flexRow alignCenter justifyCenter">
            <p className="loginTitle"> No jobs available </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedJobsMenu;
