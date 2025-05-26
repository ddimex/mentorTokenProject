import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import StartupDashboard from "../StartupDashboard";

const StartupPopup = ({
  job,
  setApplications,
  updateApplications,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        "http://localhost:10000/updateApplicationStatus",
        { applicationId, status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedApps = job.applications.filter(
        (app) => app._id !== applicationId
      );
      updateApplications(job._id, updatedApps);
    } catch (error) {
      console.error(
        "Error updating status:",
        error.response?.data || error.message
      );
    }
  };

  const seeMentor = (mentorId) => {
    navigate(`/startupDashboard/mentors/${mentorId}`);
  };

  return (
    <div className="popupContainer flexCol alignCenter justifyCenter">
      <div className="popupCard2 flexCol">
        <svg
          onClick={onClose}
          width="20"
          height="20"
          viewBox="0 0 17 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.75 4.25L4.25 12.75"
            stroke="#696CFF"
            strokeWidth="1.41667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.25 4.25L12.75 12.75"
            stroke="#696CFF"
            strokeWidth="1.41667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {job.applications && job.applications.length > 0 ? (
          job.applications.map((app) => (
            <div
              key={app._id}
              className="applicationInfoContainer flexRow alignCenter spaceBetween"
            >
              <div
                className="flexRow alignCenter"
                style={{ gap: "10px", cursor: "pointer" }}
                onClick={() => seeMentor(app.mentorId._id)}
              >
                <img
                  src={`http://localhost:10000/${app.mentorId.profilePicture}`}
                  className="pfp"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/img/mentorDefault.png";
                  }}
                />
                <h4 className="font userCardText">{app.mentorId.mentorName}</h4>
              </div>
              <div
                className="applicationBtnContainer flexRow alignCenter spaceBetween"
                style={{ width: "200px", gap: "5px" }}
              >
                <button
                  className="acceptBtn"
                  onClick={() => handleStatusUpdate(app._id, "accepted")}
                >
                  Accept
                </button>
                <button
                  className="rejectBtn"
                  onClick={() => handleStatusUpdate(app._id, "rejected")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flexRow alignCenter justifyCenter">
            <p className="font jobCardTitle">No applications yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupPopup;
