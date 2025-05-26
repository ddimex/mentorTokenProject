import axios from "axios";

const Popup = ({ job, onClose }) => {
  const handleApply = async () => {
    try {
      const mentorId = localStorage.getItem("mentorId");

      if (!mentorId) {
        alert("Mentor ID not found. Please log in.");
        return;
      }

      const response = await axios.post(
        "http://localhost:10000/applications",
        {
          mentorId,
          startupId: job.startupId._id,
          jobId: job._id,
          applicationType: "mentorToStartup",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      onClose();
    } catch (error) {
      console.error("Error applying:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message === "You have already applied to this job."
      ) {
        alert("You have already applied to this job.");
      } else {
        alert("Failed to apply. Please try again.");
      }
    }
  };

  return (
    <div className="popupContainer flexCol alignCenter justifyCenter">
      <div
        className="popupCard2 flexCol"
        style={{ gap: "0px", height: "fit-content" }}
      >
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

        <div className="startupInfoContainer flexRow alignCenter">
          <img
            src={`http://localhost:10000/${job.startupId.profilePicture}`}
            className="pfpMedium"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `/img/${job.startupId.profilePicture.replace(
                "./img/",
                ""
              )}`;
            }}
          />
          <h4 className="font userCardText">{job.startupId.startupName}</h4>
        </div>
        <h2 className="font jobCardTitle">{job.title}</h2>
        <p
          className="font jobCardSubtitle2"
          style={{ height: "fit-content", maxHeight: "100px" }}
        >
          {job.description}
        </p>
        <br />
        <button className="acceptBtn" onClick={handleApply}>
          {" "}
          Apply{" "}
        </button>
      </div>
    </div>
  );
};

export default Popup;
