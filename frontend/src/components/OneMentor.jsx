import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import DashboardHeader from "./DashboardHeader";
import DashboardMenu from "./DashboardMenu";
import OfferJobPopup from "./OfferJobPopup";
import PendingJobs from "./PendingJobs";
import AssignedJobsMenu from "./AssignedJobsMenu";
import QuickOverview from "./QuickOverview";
import Charts from "./Charts";

const OneMentor = () => {
  const location = useLocation();
  const isMentorDashboard = location.pathname.startsWith("/mentorDashboard");
  const isStartupDashboard = location.pathname.startsWith(
    "/startupDashboard/mentors/"
  );

  const { id } = useParams();
  const [mentor, setMentor] = useState(null);
  const [editableMentor, setEditableMentor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [showOfferJobPopup, setShowOfferJobPopup] = useState(false);
  const [offerJobData, setOfferJobData] = useState({
    title: "",
    description: "",
  });

  const [acceptedJobsByMentor, setAcceptedJobsByMentor] = useState([]);
  const [pendingJobsForMentor, setPendingJobsForMentor] = useState([]);

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        let response = await axios.get(
          `http://localhost:10000/startupDashboard/mentors/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMentor(response.data.data.mentor);
        setEditableMentor(response.data.data.mentor);
      } catch (err) {
        console.log("Checking mentorDashboard...");
        try {
          let response = await axios.get(
            "http://localhost:10000/mentorDashboard/myStats",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (response.data.data.mentor === null) {
            setError("Mentor profile not found.");
          } else {
            setMentor(response.data.data.mentor);
            setEditableMentor(response.data.data.mentor);
          }
        } catch (error) {
          setError("Error fetching mentor data.");
          console.log("Error fetching mentor data:", error);
        }
      }
    };
    fetchMentor();
  }, [id]);

  useEffect(() => {
    const fetchAcceptedJobsByMentor = async () => {
      try {
        const res = await axios.get(
          `http://localhost:10000/startupDashboard/mentorApplications/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAcceptedJobsByMentor(res.data.data || []);
      } catch (err) {
        console.error("Error fetching accepted jobs by mentor:", err);
      }
    };

    fetchAcceptedJobsByMentor();
  }, [id]);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axios.get(
          `http://localhost:10000/startupToMentorPending/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("fetched pending jobs: ", res.data.data);
        setPendingJobsForMentor(res.data.data || []);
      } catch (err) {
        console.error("Error fetching pending applications for mentor:", err);
      }
    };

    if (isStartupDashboard) {
      fetchPending();
    }
  }, [id]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "skills") {
      setEditableMentor({
        ...editableMentor,
        skills: value.split(", ").map((skill) => skill.trim()),
      });
    } else {
      setEditableMentor({
        ...editableMentor,
        [name]: value,
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditableMentor({
        ...editableMentor,
        profilePicture: file,
      });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("mentorName", editableMentor.mentorName);
      formData.append("email", editableMentor.email);
      formData.append("phone", editableMentor.phone);
      formData.append("skills", editableMentor.skills.join(" | "));
      formData.append("bio", editableMentor.bio);

      if (editableMentor.profilePicture instanceof File) {
        formData.append("profilePicture", editableMentor.profilePicture);
      } else if (mentor.profilePicture) {
        formData.append("existingProfilePicture", mentor.profilePicture);
      }

      const response = await axios.patch(
        "http://localhost:10000/mentorDashboard/myStats",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMentor(response.data.data.updatedMentor);
      setIsEditing(false);
    } catch (error) {
      console.error(
        "Error updating mentor:",
        error.response?.data || error.message
      );
    }
  };

  if (error) return <div>{error}</div>;
  if (!mentor) return <div></div>;

  const handleOfferChange = (e) => {
    const { name, value } = e.target;
    setOfferJobData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOfferSubmit = async () => {
    try {
      const jobRes = await axios.post(
        "http://localhost:10000/createJob",
        {
          title: offerJobData.title,
          description: offerJobData.description,
          status: "direct",
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const jobId = jobRes.data.data.newJob._id;

      await axios.post(
        "http://localhost:10000/startupToMentorApplication",
        {
          jobId,
          mentorId: mentor._id,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setShowOfferJobPopup(false);
      setOfferJobData({ title: "", description: "" });

      const res = await axios.get(
        `http://localhost:10000/startupToMentorPending/${mentor._id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setPendingJobsForMentor(res.data.data || []);
    } catch (error) {
      console.error("Error offering job:", error);
      alert("Error sending job offer.");
    }
  };

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <div className="dashboard">
      <div className="dashboard flexRow">
        <DashboardMenu />
        <div className="dashboardContainer flexCol">
          <DashboardHeader />
          <div className="mentorsContainer flexCol spaceAround">
            <div className="flexRow" style={{ height: "40%" }}>
              <div
                className="mentorCard flexCol"
                style={isEditing ? { gap: "0px" } : {}}
              >
                <div className="profileImageContainer">
                  <img
                    src={
                      imagePreview ||
                      (mentor.profilePicture
                        ? `http://localhost:10000/${mentor.profilePicture}`
                        : "/img/mentorDefault.png")
                    }
                    className="pfpXL"
                    alt="Profile"
                  />
                  {isEditing && (
                    <div>
                      <span
                        style={{
                          position: "absolute",
                          cursor: "pointer",
                          scale: "0.45",
                          top: "80px",
                          left: "375px",
                          zIndex: "100",
                          filter: "drop-shadow(2px 0px 7px  #00000040)",
                        }}
                      >
                        <img
                          src="/img/editPfp.png"
                          onClick={handleImageClick}
                        />
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="imageUploadInput"
                        style={{ display: "none", cursor: "pointer" }}
                        id="fileInput"
                      />
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <input
                    type="text"
                    name="mentorName"
                    value={editableMentor.mentorName}
                    onChange={handleInputChange}
                  />
                ) : (
                  <h2 className="font">{mentor.mentorName}</h2>
                )}
                <div className="flexRow alignCenter">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.33341 2.3335H11.6667C12.3084 2.3335 12.8334 2.8585 12.8334 3.50016V10.5002C12.8334 11.1418 12.3084 11.6668 11.6667 11.6668H2.33341C1.69175 11.6668 1.16675 11.1418 1.16675 10.5002V3.50016C1.16675 2.8585 1.69175 2.3335 2.33341 2.3335Z"
                      stroke="#696CFF"
                      stroke-width="1.16667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12.8334 3.5L7.00008 7.58333L1.16675 3.5"
                      stroke="#696CFF"
                      stroke-width="1.16667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>

                  <p className="font">
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editableMentor.email}
                        onChange={handleInputChange}
                      />
                    ) : (
                      mentor.email
                    )}
                  </p>
                </div>
                <div className="flexRow alignCenter">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_1_10037)">
                      <path
                        d="M12.8333 9.86989V11.6199C12.834 11.7824 12.8007 11.9432 12.7356 12.092C12.6705 12.2409 12.5751 12.3745 12.4554 12.4843C12.3357 12.5941 12.1943 12.6778 12.0404 12.7298C11.8865 12.7819 11.7235 12.8012 11.5617 12.7866C9.76665 12.5915 8.04242 11.9781 6.5275 10.9957C5.11807 10.1001 3.92311 8.90516 3.0275 7.49573C2.04166 5.97393 1.42814 4.24131 1.23667 2.43823C1.22209 2.27692 1.24126 2.11434 1.29296 1.96084C1.34466 1.80735 1.42775 1.6663 1.53695 1.54667C1.64615 1.42705 1.77905 1.33147 1.92721 1.26603C2.07537 1.20059 2.23553 1.16671 2.3975 1.16656H4.1475C4.4306 1.16377 4.70505 1.26402 4.9197 1.44862C5.13434 1.63322 5.27455 1.88957 5.31417 2.16989C5.38803 2.72993 5.52501 3.27982 5.7225 3.80906C5.80099 4.01785 5.81797 4.24476 5.77145 4.46291C5.72492 4.68105 5.61684 4.88129 5.46 5.03989L4.71917 5.78073C5.54958 7.24113 6.75877 8.45032 8.21917 9.28073L8.96 8.53989C9.1186 8.38306 9.31884 8.27497 9.53699 8.22845C9.75513 8.18192 9.98205 8.19891 10.1908 8.27739C10.7201 8.47488 11.27 8.61186 11.83 8.68573C12.1134 8.7257 12.3722 8.86843 12.5571 9.08677C12.7421 9.3051 12.8404 9.58381 12.8333 9.86989Z"
                        stroke="#696CFF"
                        stroke-width="1.16667"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1_10037">
                        <rect width="14" height="14" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <p className="font">
                    {isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={editableMentor.phone}
                        onChange={handleInputChange}
                      />
                    ) : (
                      mentor.phone
                    )}
                  </p>
                </div>
              </div>

              <div className="aboutMentorCard flexCol">
                <div className="flexRow alignLeft spaceBetween">
                  {isMentorDashboard ? (
                    <h3 className="font" style={{ color: "#696CFF" }}>
                      About
                    </h3>
                  ) : (
                    <h3 className="font" style={{ color: "#696CFF" }}>
                      About Mentor
                    </h3>
                  )}

                  {isMentorDashboard ? (
                    isEditing ? (
                      <div
                        className="flexRow spaceBetween"
                        style={{ width: "310px", gap: "10px" }}
                      >
                        <button className="acceptBtn" onClick={handleSave}>
                          Save Changes
                        </button>
                        <button
                          className="rejectBtn"
                          onClick={() => {
                            setIsEditing(false);
                          }}
                        >
                          Discard Changes
                        </button>
                      </div>
                    ) : (
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={handleEditClick}
                        style={{ cursor: "pointer" }}
                      >
                        <g clipPath="url(#clip0_37_1347)">
                          <path
                            d="M8.25 3H3C2.60218 3 2.22064 3.15804 1.93934 3.43934C1.65804 3.72064 1.5 4.10218 1.5 4.5V15C1.5 15.3978 1.65804 15.7794 1.93934 16.0607C2.22064 16.342 2.60218 16.5 3 16.5H13.5C13.8978 16.5 14.2794 16.342 14.5607 16.0607C14.842 15.7794 15 15.3978 15 15V9.75"
                            stroke="#696CFF"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M13.875 1.87517C14.1734 1.5768 14.578 1.40918 15 1.40918C15.422 1.40918 15.8266 1.5768 16.125 1.87517C16.4234 2.17354 16.591 2.57821 16.591 3.00017C16.591 3.42213 16.4234 3.8268 16.125 4.12517L9 11.2502L6 12.0002L6.75 9.00017L13.875 1.87517Z"
                            stroke="#696CFF"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_37_1347">
                            <rect width="22" height="22" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    )
                  ) : (
                    <button
                      onClick={() => setShowOfferJobPopup(true)}
                      className="offerJobButton acceptBtn flexRow alignCenter"
                      style={{ gap: "5px" }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M14.3225 8.49563H10.097V4.27016C10.097 3.88072 9.78149 3.56592 9.39275 3.56592C9.00401 3.56592 8.6885 3.88072 8.6885 4.27016V8.49563H4.46303C4.07429 8.49563 3.75879 8.81043 3.75879 9.19988C3.75879 9.58932 4.07429 9.90412 4.46303 9.90412H8.6885V14.1296C8.6885 14.519 9.00401 14.8338 9.39275 14.8338C9.78149 14.8338 10.097 14.519 10.097 14.1296V9.90412H14.3225C14.7112 9.90412 15.0267 9.58932 15.0267 9.19988C15.0267 8.81043 14.7112 8.49563 14.3225 8.49563Z"
                          fill="white"
                        />
                      </svg>
                      Offer new job
                    </button>
                  )}
                </div>
                <h4 className="flexRow alignCenter">
                  Skills:
                  {isEditing ? (
                    <input
                      type="text"
                      name="skills"
                      value={editableMentor.skills.join(", ")}
                      onChange={handleInputChange}
                    />
                  ) : (
                    ` ${mentor.skills.join(" | ") || "No skills provided"}`
                  )}
                </h4>

                <p>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={editableMentor.bio || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    mentor.bio || "No bio available"
                  )}
                </p>
              </div>
            </div>

            {showOfferJobPopup && (
              <OfferJobPopup
                offerJobData={offerJobData}
                handleOfferChange={handleOfferChange}
                handleOfferSubmit={handleOfferSubmit}
                onCancel={() => setShowOfferJobPopup(false)}
              />
            )}

            <div
              className="flexRow"
              style={{ height: "62%", width: "98%", margin: "0" }}
            >
              {isStartupDashboard && (
                <AssignedJobsMenu
                  mentorId={mentor._id}
                  applications={acceptedJobsByMentor}
                />
              )}
              {isStartupDashboard && (
                <PendingJobs
                  mentorId={mentor._id}
                  applications={pendingJobsForMentor}
                />
              )}
              {isMentorDashboard && <Charts />}
              {isMentorDashboard && <QuickOverview />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneMentor;
