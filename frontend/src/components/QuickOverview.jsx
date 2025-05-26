import React, { useEffect, useState } from "react";
import axios from "axios";

const QuickOverview = ({ mode }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const token = localStorage.getItem("token");
        const endpoint =
          mode === "startup"
            ? "http://localhost:10000/startupOverview"
            : "http://localhost:10000/mentorOverview";

        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching overview:", err);
        setLoading(false);
      }
    };

    fetchOverview();
  }, [mode]);

  if (loading) return <p>Loading stats...</p>;
  if (!data) return <p>No data available.</p>;

  return (
    <div className="flexCol">
      <div className="quickOverviewContainer flexCol spaceBetween">
        {mode === "startup" ? (
          <>
            <h3 className="dashboardTitle" style={{ margin: "0px" }}>
              Quick Overview
            </h3>
            <p className="dashboardSubtitle" style={{ margin: "0px" }}>
              In the last month
            </p>
            <div className="quickOverviewCard">
              <p style={{ margin: "0px" }}>Total Mentors</p>
              <h1 style={{ margin: "0px" }}>{data.totalMentors}</h1>
            </div>
            <div className="quickOverviewCard">
              <p style={{ margin: "0px" }}>Total Assigned Jobs</p>
              <h1 style={{ margin: "0px" }}>{data.totalAssignedJobs}</h1>
            </div>
            <div className="quickOverviewCard activeCard">
              <p style={{ margin: "0px" }}>Finished Jobs</p>
              <h1 style={{ margin: "0px" }}>{data.totalFinishedJobs}</h1>
            </div>
          </>
        ) : (
          <>
            <h3 className="dashboardTitle" style={{ margin: "0px" }}>
              Quick Overview
            </h3>
            <div className="quickOverviewCard">
              <p style={{ margin: "0px" }}>Total Jobs</p>
              <h1 style={{ margin: "0px" }}>{data.totalJobs}</h1>
            </div>
            <div className="quickOverviewCard">
              <p style={{ margin: "0px" }}>Total Assigned Jobs</p>
              <h1 style={{ margin: "0px" }}>{data.totalStartupToMentorJobs}</h1>
            </div>
            <div className="quickOverviewCard">
              <p style={{ margin: "0px" }}>Jobs You Have Applied To</p>
              <h1 style={{ margin: "0px" }}>{data.totalMentorToStartupJobs}</h1>
            </div>
            <div className="quickOverviewCard activeCard">
              <p style={{ margin: "0px" }}>Finished Jobs</p>
              <h1 style={{ margin: "0px" }}>{data.totalFinishedJobs}</h1>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuickOverview;
