import React, { useEffect, useState } from "react";
import axios from "axios";

const BestMentors = () => {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    const fetchBestMentors = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:10000/bestMentors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMentors(res.data || []);
      } catch (err) {
        console.error("Error fetching best mentors:", err);
      }
    };

    fetchBestMentors();
  }, []);

  return (
    <div className="bestMentorsMenu">
      <h3 className="dashboardTitle">Best Performing Mentors</h3>
      <div className="bestMentorsContainer flexCol spaceBetween">
        {mentors.length > 0 ? (
          mentors.map((mentor, index) => (
            <div
              key={mentor._id}
              className="bestMentorCard flexRow alignCenter spaceBetween"
            >
              <img
                src={`http://localhost:10000/${mentor.mentorDetails.profilePicture}`}
                className="pfp"
                alt="Mentor"
              />
              <p className="font" style={{ width: "140px" }}>
                {mentor.mentorDetails.mentorName}
              </p>

              <div
                className="flexCol alignCenter justifyCenter"
                style={{ width: "170px" }}
              >
                <p className="font" style={{ color: "#696CFF" }}>
                  {" "}
                  {mentor.completedJobs}{" "}
                </p>
                <p className="font loginSubtitle"> Achieved Jobs </p>
              </div>

              <svg
                width="39"
                height="38"
                viewBox="0 0 39 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_1_10760)">
                  <path
                    d="M26.0312 23.1694C25.3513 22.9873 24.9479 22.2885 25.1301 21.6087L27.7686 11.7614L17.9214 9.12287C17.2416 8.94072 16.8381 8.24195 17.0203 7.56214C17.2024 6.88233 17.9012 6.4789 18.581 6.66105L29.6592 9.62944C30.339 9.8116 30.7424 10.5104 30.5603 11.1902L27.5919 22.2683C27.4097 22.9482 26.711 23.3516 26.0312 23.1694ZM18.2275 27.6749C17.5477 27.4927 17.1443 26.794 17.3264 26.1141L19.965 16.2669L10.1177 13.6283C9.43791 13.4462 9.03448 12.7474 9.21663 12.0676C9.39879 11.3878 10.0975 10.9843 10.7774 11.1665L21.8555 14.1349C22.5353 14.317 22.9388 15.0158 22.7566 15.6956L19.7882 26.7738C19.6061 27.4536 18.9073 27.857 18.2275 27.6749Z"
                    fill="#CBC6D7"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1_10760">
                    <rect
                      width="30.5839"
                      height="30.5839"
                      fill="white"
                      transform="translate(8.49231) rotate(15)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
          ))
        ) : (
          <div className="jobCardSmall applicationInfoContainer flexRow alignCenter justifyCenter">
            <p className="loginTitle">No mentors have completed jobs yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BestMentors;
