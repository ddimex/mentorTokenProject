import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardMenu from "./components/DashboardMenu";
import AssignedJobsMenu from "./components/AssignedJobsMenu";
import DashboardHeader from "./components/DashboardHeader";
import PendingJobs from "./components/PendingJobs";
import ApplicationsSent from "./components/ApplicationsSent";
const MentorDashboard = () => {
  const [pendingApplications, setPendingApplications] = useState([]);
  const [acceptedApplications, setAcceptedApplications] = useState([]);

  const fetchApplications = async () => {
    const token = localStorage.getItem("token");
    try {
      const [pendingRes, acceptedRes] = await Promise.all([
        axios.get("http://localhost:10000/mentorApplicationsReceived", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:10000/acceptedMentorApplications", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setPendingApplications(pendingRes.data.data || []);
      setAcceptedApplications(acceptedRes.data.data || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusUpdate = async (applicationId, status) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        "http://localhost:10000/updateApplicationStatus",
        { applicationId, status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPendingApplications((prev) =>
        prev.filter((app) => app._id !== applicationId)
      );

      const acceptedApp = pendingApplications.find(
        (app) => app._id === applicationId
      );

      if (status === "accepted" && acceptedApp) {
        setAcceptedApplications((prev) => [
          ...prev,
          { ...acceptedApp, status, acceptedStatus: "inProgress" },
        ]);
      }
    } catch (error) {
      console.error(
        "Error updating application status:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard flexRow">
        <DashboardMenu />
        <div className="dashboardContainer flexCol">
          <DashboardHeader />
          <div className="mentorsContainer flexRow">
            <AssignedJobsMenu
              applications={acceptedApplications}
              setApplications={setAcceptedApplications}
            />
            <div className="flexCol">
              <PendingJobs
                applications={pendingApplications}
                onUpdateStatus={handleStatusUpdate}
              />
              <ApplicationsSent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
