import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import DashboardMenu from "./DashboardMenu";
import QuickOverview from "./QuickOverview";

const SDMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [mentorRatings, setMentorRatings] = useState({});
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:10000/startupDashboard/mentors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setMentors(res.data.data.mentors || []);
      })
      .catch((err) => {
        console.log(err);
        setMentors([]);
      });
  }, []);

  useEffect(() => {
    const fetchRatings = async () => {
      const ratingsMap = {};
  
      await Promise.all(
        mentors.map(async (mentor) => {
          try {
            const res = await axios.get(`http://localhost:10000/mentorRating/${mentor._id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            ratingsMap[mentor._id] = res.data.rating;
          } catch (err) {
            console.error(`Error fetching rating for mentor ${mentor._id}:`, err);
            ratingsMap[mentor._id] = 0;
          }
        })
      );
  
      setMentorRatings(ratingsMap);
      console.log("Ratings fetched:", ratingsMap);
    };
  
    if (mentors.length > 0) {
      fetchRatings();
    }
  }, [mentors]);

  return (
    <div className="dashboard">
      <div className="dashboard flexRow">
        <DashboardMenu />
        <div className="dashboardContainer flexCol">
          <DashboardHeader searchResults={searchResults} setSearchResults={setSearchResults} />
  
          <div className="mentorsContainer flexRow">
            <div className="mentorsContainer2 flexCol">
              <div className="cardsContainer flexCol">
                {
                  (() => {
                    const displayMentors = searchResults?.mentors?.length > 0 ? searchResults.mentors : mentors;
                    return displayMentors.length > 0 ? (
                      displayMentors.map((mentor, index) => (
                        <div
                          className="mentorsCard flexRow alignCenter"
                          style={{ position: "relative" }}
                          key={index}
                        >
                          <img
                            src={`http://localhost:10000/${mentor.profilePicture}`}
                            className="pfpLarge"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `/img/${mentor.profilePicture.replace("./img/", "")}`;
                            }}
                          />
  
                          <h4 className="font">
                            <div className="flexCol">
                              <h3
                                style={{
                                  fontFamily: "inter",
                                  fontWeight: "500",
                                  fontSize: "20px",
                                  color: "#000000",
                                  margin: "5px 0px 3.5px 20px",
                                }}
                              >
                                {mentor.mentorName}
                              </h3>
  
                              <div
                                className="flexRow"
                                style={{ margin: "5px 0px 3.5px 20px", gap: "5px" }}
                              >
                                {[1, 2, 3, 4, 5].map((num) =>
                                  num <= (mentorRatings[mentor._id] || 0) ? (
                                    <svg
                                      key={num}
                                      width="16"
                                      height="16"
                                      viewBox="0 0 16 16"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M8.00001 1L5.72501 5.61L0.640015 6.345L4.32001 9.935L3.45001 15L8.00001 12.61L12.55 15L11.68 9.935L15.36 6.35L10.275 5.61L8.00001 1Z"
                                        fill="url(#paint0_linear_1_10570)"
                                      />
                                      <defs>
                                        <linearGradient
                                          id="paint0_linear_1_10570"
                                          x1="8.00001"
                                          y1="1"
                                          x2="8.00001"
                                          y2="15"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop offset="0.161458" stopColor="#6669FB" />
                                          <stop offset="0.635417" stopColor="#8E4FFF" />
                                          <stop offset="0.755208" stopColor="#9059F1" />
                                          <stop offset="1" stopColor="#9747FF" />
                                        </linearGradient>
                                      </defs>
                                    </svg>
                                  ) : (
                                    <svg
                                      key={num}
                                      width="16"
                                      height="16"
                                      viewBox="0 0 16 16"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M5.79654 6.10486L6.05695 6.06722L6.17339 5.83127L8.00001 2.12984L9.82664 5.83127L9.94294 6.06694L10.203 6.10479L14.2854 6.69888L11.3311 9.57685L11.1427 9.7604L11.1872 10.0196L11.8857 14.0863L8.23253 12.1674L8.00001 12.0452L7.7675 12.1674L4.11428 14.0863L4.8128 10.0196L4.85729 9.76062L4.66916 9.5771L1.71467 6.69486L5.79654 6.10486Z"
                                        stroke="url(#paint0_linear_1_10576)"
                                      />
                                      <defs>
                                        <linearGradient
                                          id="paint0_linear_1_10576"
                                          x1="8.00001"
                                          y1="1"
                                          x2="8.00001"
                                          y2="15"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop offset="0.161458" stopColor="#6669FB" />
                                          <stop offset="0.635417" stopColor="#8E4FFF" />
                                          <stop offset="0.755208" stopColor="#9059F1" />
                                          <stop offset="1" stopColor="#9747FF" />
                                        </linearGradient>
                                      </defs>
                                    </svg>
                                  )
                                )}
                              </div>
  
                              <h6>{mentor.skills}</h6>
                              <h6>{mentor.bio}</h6>
                            </div>
                          </h4>
  
                          <Link to={`/startupDashboard/mentors/${mentor._id}`}>
                            <button
                              className="acceptBtn"
                              style={{ position: "absolute", bottom: "20px", right: "20px" }}
                            >
                              View Mentor
                            </button>
                          </Link>
                        </div>
                      ))
                    ) : (
                      <div className="jobCardSmall applicationInfoContainer flexRow alignCenter justifyCenter">
                      <h3 className="loginTitle">No mentors available</h3>
                      </div>
                    );
                  })()
                }
              </div>
            </div>
  
            <QuickOverview mode="startup" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SDMentors;
