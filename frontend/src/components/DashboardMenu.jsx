import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const DashboardMenu = () => {
  const location = useLocation();

  const isStartupDashboard = location.pathname.startsWith("/startupDashboard");
  const isMentorDashboard = location.pathname.startsWith("/mentorDashboard");

  const [activeButton, setActiveButton] = useState();
  const [position, setPosition] = useState("pos1");
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("isMenuCollapsed");
    return saved === "true";
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      localStorage.setItem("isMenuCollapsed", !prev);
      return !prev;
    });
  };

  useEffect(() => {
    if (isStartupDashboard) {
      if (location.pathname === "/startupDashboard") {
        setActiveButton("dashboard");
        setPosition("pos1");
      } else if (location.pathname === "/startupDashboard/mentors") {
        setActiveButton("mentors");
        setPosition("pos2");
      } else if (location.pathname === "/startupDashboard/jobs") {
        setActiveButton("jobs");
        setPosition("pos3");
      } else {
        setActiveButton("mentors");
        setPosition("pos2");
      }
    } else if (isMentorDashboard) {
      if (location.pathname === "/mentorDashboard") {
        setActiveButton("mentorDashboard");
        setPosition("pos1");
      } else if (location.pathname === "/mentorDashboard/myStats") {
        setActiveButton("myStats");
        setPosition("pos2");
      } else if (location.pathname === "/mentorDashboard/jobFeed") {
        setActiveButton("jobFeed");
        setPosition("pos3");
      } else {
        setActiveButton("mentorDashboard");
        setPosition("pos1");
      }
    }
  }, [location.pathname]);

  const handleButtonClick = (buttonName, pos) => {
    setActiveButton(buttonName);
    setPosition(pos);

    if (buttonName === "mentorDashboard") {
      navigate("/mentorDashboard");
    } else if (buttonName === "myStats") {
      navigate("/mentorDashboard/myStats");
    } else if (buttonName === "jobFeed") {
      navigate("/mentorDashboard/jobFeed");
    } else if (buttonName === "dashboard") {
      navigate("/startupDashboard");
    } else if (buttonName === "mentors") {
      navigate("/startupDashboard/mentors");
    } else if (buttonName === "jobs") {
      navigate("/startupDashboard/jobs");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("startupId");
    localStorage.removeItem("mentorId");
    localStorage.removeItem("token");
    localStorage.removeItem("isMenuCollapsed");
    navigate("/");
  };

  return (
    <div
      className="flexRow"
      style={{
        width: isCollapsed ? "110px" : "19.2%",
        transition: "all 0.5s ease",
      }}
    >
      <div className={`dashboardMenu ${isCollapsed ? "collapsedMenu" : ""}`}>
        <div className="dashboardMenuLogo flexRow alignCenter spaceBetween">
          <svg
            style={{
              position: "relative",
              left: isCollapsed ? "12" : "",
              scale: isCollapsed ? "1.2" : "",
            }}
            width="37"
            height="37"
            viewBox="0 0 37 37"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M32.375 11.3802C32.375 11.0171 32.1781 10.6824 31.8606 10.5061L18.9856 3.3533C18.6836 3.18551 18.3164 3.18551 18.0143 3.3533L5.13933 10.5061C4.82187 10.6824 4.62498 11.0171 4.62498 11.3802V25.6201C4.62498 25.9833 4.82187 26.3179 5.13933 26.4943L18.0143 33.647C18.3164 33.8148 18.6836 33.8148 18.9856 33.647L31.8606 26.4943C32.1781 26.3179 32.375 25.9833 32.375 25.6201V11.3802ZM18.0147 6.88323C18.3165 6.71572 18.6834 6.71572 18.9852 6.88323L26.0355 10.7961C26.7219 11.177 26.7218 12.164 26.0354 12.5449L23.6439 13.8717C23.2471 14.0918 22.7569 14.0104 22.4048 13.7241C21.3402 12.8584 19.9802 12.3335 18.5 12.3335C17.0197 12.3335 15.6598 12.8584 14.5951 13.7241C14.2431 14.0104 13.7528 14.0918 13.356 13.8717L10.9646 12.5449C10.2781 12.164 10.2781 11.177 10.9644 10.7961L18.0147 6.88323ZM16.9583 27.8398C16.9583 28.6021 16.1396 29.0841 15.473 28.7142L8.22304 24.6904C7.90537 24.5141 7.70831 24.1794 7.70831 23.8161V15.976C7.70831 15.2134 8.52765 14.7315 9.19419 15.102L11.837 16.5712C12.2447 16.7978 12.4334 17.2762 12.3774 17.7393C12.3474 17.9871 12.3333 18.2419 12.3333 18.5002C12.3333 21.0954 13.9371 23.3245 16.219 24.2272C16.6443 24.3955 16.9583 24.7866 16.9583 25.2439V27.8398ZM15.4166 18.5002C15.4166 16.8043 16.8041 15.4168 18.5 15.4168C20.1958 15.4168 21.5833 16.8043 21.5833 18.5002C21.5833 20.196 20.1958 21.5835 18.5 21.5835C16.8041 21.5835 15.4166 20.196 15.4166 18.5002ZM21.5269 28.7142C20.8604 29.0841 20.0416 28.6021 20.0416 27.8398V25.2593C20.0416 24.802 20.3557 24.4109 20.781 24.2427C23.0628 23.3399 24.6666 21.1109 24.6666 18.5156C24.6666 18.2503 24.6517 17.9888 24.6201 17.7329C24.5633 17.2731 24.7521 16.7996 25.157 16.5745L27.8058 15.102C28.4723 14.7315 29.2916 15.2134 29.2916 15.976V23.8161C29.2916 24.1794 29.0946 24.5141 28.7769 24.6904L21.5269 28.7142Z"
              fill="#696CFF"
            />
          </svg>
          {!isCollapsed && <h1> Mentor Token </h1>}
        </div>
        <div className="dashboardClip"> </div>

        <div
          className={`dashboardClip2 ${position} ${
            isCollapsed ? "collapsed" : "expanded"
          }`}
        />
        <div
          className={`activeIndicator ${position} ${
            isCollapsed ? "collapsed" : "expanded"
          }`}
        />

        <img
          className={`backBtn ${isCollapsed ? "rotate" : ""}`}
          src="/img/backBtn2.png"
          onClick={toggleCollapse}
          style={{ cursor: "pointer" }}
        />

        <div
          className="buttonsContainer flexCol alignCenter"
          style={{
            width: isCollapsed ? "5%" : "31%",
            left: isCollapsed ? "20px" : "-110px",
          }}
        >
          {isStartupDashboard && (
            <>
              <button
                onClick={() => handleButtonClick("dashboard", "pos1")}
                className={`flexRow alignCenter ${
                  activeButton === "dashboard" ? "buttonActive" : ""
                }`}
              >
                <img
                  className={`menuIcon ${
                    isCollapsed ? "collapsedIcon" : "expandedIcon"
                  }`}
                  src={
                    activeButton === "dashboard"
                      ? "/img/icons/dashboardActive.png"
                      : "/img/icons/dashboardInactive.png"
                  }
                />
                {!isCollapsed && (
                  <h3
                    style={{
                      color: activeButton === "dashboard" ? "#696CFF" : "",
                    }}
                    className="font dashboardText"
                  >
                    Dashboard
                  </h3>
                )}
              </button>

              <button
                onClick={() => {
                  handleButtonClick("mentors", "pos2");
                }}
                className={`flexRow alignCenter ${
                  activeButton === "mentors" ? "buttonActive" : ""
                }`}
              >
                <img
                  className={`menuIcon ${
                    isCollapsed ? "collapsedIcon" : "expandedIcon"
                  }`}
                  src={
                    activeButton === "mentors"
                      ? "/img/icons/mentorsActive.png"
                      : "/img/icons/mentorsInactive.png"
                  }
                />
                {!isCollapsed && (
                  <h3
                    style={{
                      color: activeButton === "mentors" ? "#696CFF" : "",
                    }}
                    className="font dashboardText"
                  >
                    Mentors
                  </h3>
                )}
              </button>

              <button
                onClick={() => handleButtonClick("jobs", "pos3")}
                className={`flexRow alignCenter ${
                  activeButton === "jobs" ? "buttonActive" : ""
                }`}
              >
                <img
                  className={`menuIcon ${
                    isCollapsed ? "collapsedIcon" : "expandedIcon"
                  }`}
                  src={
                    activeButton === "jobs"
                      ? "/img/icons/jobsActive.png"
                      : "/img/icons/jobsInactive.png"
                  }
                />
                {!isCollapsed && (
                  <h3
                    style={{ color: activeButton === "jobs" ? "#696CFF" : "" }}
                    className="font dashboardText"
                  >
                    Jobs
                  </h3>
                )}
              </button>
            </>
          )}

          {isMentorDashboard && (
            <>
              <button
                onClick={() => handleButtonClick("mentorDashboard", "pos1")}
                className={`flexRow alignCenter ${
                  activeButton === "mentorDashboard" ? "buttonActive" : ""
                }`}
              >
                <img
                  className={`menuIcon ${
                    isCollapsed ? "collapsedIcon" : "expandedIcon"
                  }`}
                  src={
                    activeButton === "mentorDashboard"
                      ? "/img/icons/dashboardActive.png"
                      : "/img/icons/dashboardInactive.png"
                  }
                />
                {!isCollapsed && (
                  <h3
                    style={{
                      color:
                        activeButton === "mentorDashboard" ? "#696CFF" : "",
                    }}
                    className="font dashboardText"
                  >
                    Dashboard
                  </h3>
                )}
              </button>

              <button
                onClick={() => handleButtonClick("myStats", "pos2")}
                className={`flexRow alignCenter ${
                  activeButton === "myStats" ? "buttonActive" : ""
                }`}
              >
                <img
                  className={`menuIcon ${
                    isCollapsed ? "collapsedIcon" : "expandedIcon"
                  }`}
                  src={
                    activeButton === "myStats"
                      ? "/img/icons/myStatsActive.png"
                      : "/img/icons/myStatsInactive.png"
                  }
                />
                {!isCollapsed && (
                  <h3
                    style={{
                      color: activeButton === "myStats" ? "#696CFF" : "",
                    }}
                    className="font dashboardText"
                  >
                    My Stats
                  </h3>
                )}
              </button>

              <button
                onClick={() => handleButtonClick("jobFeed", "pos3")}
                className={`flexRow alignCenter ${
                  activeButton === "jobFeed" ? "buttonActive" : ""
                }`}
              >
                <img
                  className={`menuIcon ${
                    isCollapsed ? "collapsedIcon" : "expandedIcon"
                  }`}
                  src={
                    activeButton === "jobFeed"
                      ? "/img/icons/jobsActive.png"
                      : "/img/icons/jobsInactive.png"
                  }
                />
                {!isCollapsed && (
                  <h3
                    style={{
                      color: activeButton === "jobFeed" ? "#696CFF" : "",
                    }}
                    className="font dashboardText"
                  >
                    Job Feed
                  </h3>
                )}
              </button>
            </>
          )}
        </div>

        <img
          onClick={handleLogout}
          className="logoutBtn"
          src={
            isCollapsed
              ? "/img/icons/logoutIcon.png"
              : "/img/icons/logoutButton.png"
          }
          style={{
            position: "relative",
            scale: isCollapsed ? "0.8" : "1.2",
            left: isCollapsed ? "27px" : "43px",
            bottom: "95px",
            transition: "all 0.3s ease",
          }}
        />
      </div>
    </div>
  );
};

export default DashboardMenu;
