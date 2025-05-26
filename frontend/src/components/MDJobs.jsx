import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardHeader from "./DashboardHeader";
import DashboardMenu from "./DashboardMenu";
import Popup from "./Popup";

const MDJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const [popup, setPopup] = useState(null);
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:10000/jobs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setJobs(res.data.data.jobs || []);
      })
      .catch((err) => {
        console.log(err);
        setJobs([]);
      });
  }, []);

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
            <div className="flexRow alignCenter spaceBetween">
              <h4 className="dashboardTitle">Startup Open Jobs </h4>
            </div>

            <div className="jobCardContainer flexRow">
              {(() => {
                const displayJobs =
                  searchResults?.jobs?.length > 0 ? searchResults.jobs : jobs;

                return displayJobs.length > 0 ? (
                  displayJobs.map((job, index) => (
                    <div
                      className="jobCardLarge flexCol alignCenter"
                      key={index}
                    >
                      <div className="flexRow alignCenter">
                        <img
                          src={`http://localhost:10000/${job.startupId.profilePicture}`}
                          className="pfp"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `/img/${job.startupId.profilePicture.replace(
                              "./img/",
                              ""
                            )}`;
                          }}
                        />
                        <h4 className="font userCardText">
                          {job.startupId.startupName}
                        </h4>
                      </div>
                      <h4 className="font jobCardTitle">{job.title}</h4>
                      <h4 className="font jobCardSubtitle">
                        {job.description}
                      </h4>
                      <br />
                      <br />
                      <button
                        className="acceptBtn flexRow alignCenter"
                        onClick={() => {
                          setPopup(index);
                          setActiveJob(job);
                        }}
                      >
                        {" "}
                        View More{" "}
                      </button>

                      {popup === index && activeJob && (
                        <Popup
                          job={activeJob}
                          onClose={() => setActiveJob(null)}
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <h3>No jobs available</h3>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MDJobs;
