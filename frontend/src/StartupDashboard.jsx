import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardMenu from "./components/DashboardMenu";
import AssignedJobsMenu from "./components/AssignedJobsMenu";
import DashboardHeader from "./components/DashboardHeader";
import BestMentors from "./components/BestMentors";
import Charts from "./components/Charts";

const StartupDashboard = () => {
  const [acceptedStartupApplications, setAcceptedStartupApplications] = useState([]);

  useEffect(() => {
    const fetchAcceptedStartupApplications = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:10000/acceptedStartupApplications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAcceptedStartupApplications(response.data.data || []);
      } catch (error) {
        console.error("Error fetching accepted startup applications:", error);
      }
    };

    fetchAcceptedStartupApplications();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard flexRow">
        <DashboardMenu />
        <div className="dashboardContainer flexCol">
          <DashboardHeader />
          <div className="mentorsContainer flexRow">
            <AssignedJobsMenu
              applications={acceptedStartupApplications}
              setApplications={setAcceptedStartupApplications}
            />
            <div className="flexCol">
              <BestMentors />
              <Charts />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupDashboard;
