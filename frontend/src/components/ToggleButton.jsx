import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ToggleButton = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("startup");

  useEffect(() => {
    if (location.pathname === "/registerMentor") {
      setSelected("mentor");
    } else {
      setSelected("startup");
    }
  }, [location.pathname]);

  const handleClick = (button, path) => {
    setSelected(button);
    navigate(path);
  };

  return (
    <div className="toggle-container flexRow alignCenter">
      <button
        className={`toggle-button ${selected === "startup" ? "selected" : ""}`}
        onClick={() => handleClick("startup", "/registerStartup")}
      >
        Startup
      </button>
      <button
        className={`toggle-button ${selected === "mentor" ? "selected" : ""}`}
        onClick={() => handleClick("mentor", "/registerMentor")}
      >
        Mentor
      </button>
    </div>
  );
};

export default ToggleButton;