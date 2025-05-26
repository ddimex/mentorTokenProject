import React, { useEffect, useState } from "react";
import axios from "axios";

const DashboardHeader = ({ setSearchResults }) => {
  const [startup, setStartup] = useState(null);
  const [mentor, setMentor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const isMentorDashboard =
    window.location.pathname.includes("mentorDashboard");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (isMentorDashboard) {
          const mentorRes = await axios
            .get("http://localhost:10000/mentorDashboard", {
              headers: { Authorization: `Bearer ${token}` },
            })
            .catch((err) => {
              setError("Failed to load mentor data");
              return null;
            });

          if (mentorRes) {
            setMentor(mentorRes.data.data.mentor);
          }
        } else {
          const startupRes = await axios
            .get("http://localhost:10000/startupDashboard", {
              headers: { Authorization: `Bearer ${token}` },
            })
            .catch((err) => {
              setError("Failed to load startup data");
              return null;
            });

          if (startupRes) {
            setStartup(startupRes.data.data.startup);
          }
        }
      } catch (error) {
        setError("Error fetching data");
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm) return;
    try {
      const token = localStorage.getItem("token");

      if (startup) {
        const mentorRes = await axios.get(
          `http://localhost:10000/searchMentors?query=${searchTerm}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const jobRes = await axios.get(
          `http://localhost:10000/searchMyJobs?query=${searchTerm}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setSearchResults({
          mentors: mentorRes.data.data,
          jobs: jobRes.data.data,
        });
      } else if (mentor) {
        const jobRes = await axios.get(
          `http://localhost:10000/searchJobs?query=${searchTerm}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setSearchResults({
          jobs: jobRes.data.data,
        });
      }
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setSearchResults(term);
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboardHeader flexRow alignCenter spaceBetween">
      <div className="searchBar flexRow alignCenter">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
            stroke="#697A8D"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 22L20 20"
            stroke="#697A8D"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
      </div>

      {startup ? (
        <div className="userCard flexRow alignCenter spaceBetween">
          <img
            src={
              startup.profilePicture
                ? `http://localhost:10000/${startup.profilePicture}`
                : "/img/startupDefault.png"
            }
            className="pfp"
            alt="Startup Profile"
          />
          <h2 className="font userCardText">{startup.startupName}</h2>
        </div>
      ) : mentor ? (
        <div className="userCard flexRow alignCenter">
          <img
            src={
              mentor.profilePicture
                ? `http://localhost:10000/${mentor.profilePicture}`
                : "/img/mentorDefault.png"
            }
            className="pfp"
            alt="Mentor Profile"
          />
          <h2 className="font userCardText">{mentor.mentorName}</h2>
        </div>
      ) : null}
    </div>
  );
};

export default DashboardHeader;
