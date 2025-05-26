import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RegisterLoginBG from "./components/RegisterLoginBG";
import ForgotPassword from "./components/ForgotPassword";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPopup, setShowForgotPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:10000/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("mentorId", res.data.user.mentorId);
      localStorage.setItem("startupId", res.data.user.startupId);

      if (res.data.user.role === "startup") {
        navigate("/startupDashboard");
      } else {
        navigate("/mentorDashboard");
      }

      console.log("Res data:", res.data);
    } catch (err) {
      console.log("Login failed:", err);

      if (err.response && err.response.status === 401) {
        setErrorMessage("Wrong email or password");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flexRow">
      <RegisterLoginBG />

      <div className="formContainer">
        <div className="loginContainer flexCol">
          <svg
            width="49"
            height="55"
            viewBox="0 0 49 55"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M49 15.1269C49 14.4856 48.6523 13.8948 48.0918 13.5833L25.3575 0.953214C24.8242 0.656935 24.1758 0.656935 23.6425 0.953213L0.908235 13.5833C0.347666 13.8948 0 14.4856 0 15.1269L0 40.2712C0 40.9124 0.347665 41.5033 0.908234 41.8147L23.6425 54.4448C24.1758 54.7411 24.8242 54.7411 25.3575 54.4448L48.0918 41.8147C48.6523 41.5033 49 40.9124 49 40.2712V15.1269ZM23.6431 7.18625C24.1761 6.89046 24.8239 6.89046 25.3569 7.18625L37.806 14.0954C39.018 14.768 39.0178 16.5109 37.8058 17.1834L33.583 19.5263C32.8824 19.915 32.0167 19.7711 31.3951 19.2656C29.5152 17.7371 27.1138 16.8101 24.5 16.8101C21.8862 16.8101 19.4848 17.7371 17.6049 19.2656C16.9833 19.7711 16.1176 19.915 15.417 19.5263L11.1942 17.1834C9.98215 16.5109 9.98204 14.768 11.194 14.0954L23.6431 7.18625ZM21.7778 44.1907C21.7778 45.5367 20.3321 46.3878 19.1551 45.7346L6.35334 38.6296C5.7924 38.3183 5.44444 37.7272 5.44444 37.0857V23.242C5.44444 21.8954 6.89121 21.0444 8.06816 21.6987L12.7348 24.2929C13.4546 24.6931 13.7878 25.5378 13.689 26.3554C13.6361 26.7931 13.6111 27.2429 13.6111 27.699C13.6111 32.2817 16.4431 36.2177 20.4723 37.8117C21.2232 38.1088 21.7778 38.7993 21.7778 39.6069V44.1907ZM19.0556 27.699C19.0556 24.7046 21.5056 22.2546 24.5 22.2546C27.4944 22.2546 29.9444 24.7046 29.9444 27.699C29.9444 30.6935 27.4944 33.1435 24.5 33.1435C21.5056 33.1435 19.0556 30.6935 19.0556 27.699ZM29.8449 45.7346C28.6679 46.3878 27.2222 45.5367 27.2222 44.1907V39.6341C27.2222 38.8266 27.7768 38.136 28.5277 37.8389C32.5569 36.2449 35.3889 32.3089 35.3889 27.7263C35.3889 27.2579 35.3626 26.7962 35.3067 26.3442C35.2064 25.5324 35.5397 24.6962 36.2547 24.2988L40.9318 21.6987C42.1088 21.0444 43.5556 21.8954 43.5556 23.242V37.0857C43.5556 37.7272 43.2076 38.3183 42.6467 38.6296L29.8449 45.7346Z"
              fill="#696CFF"
            />
          </svg>

          <div className="loginText">
            <h1 className="loginTitle">Log in to mentor token</h1>
            <p className="loginSubtitle">Enter your email and pass to login.</p>
          </div>

          {errorMessage && (
            <div
              className="font"
              style={{
                color: "#696CFF",
                marginBottom: "1rem",
                textTransform: "uppercase",
                textDecoration: "underline",
              }}
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="flexCol">
            <div className="inputWrapper">
              <input
                type="email"
                placeholder=" "
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage("");
                }}
                required
              />
              <label> Email </label>
            </div>
            <div className="inputWrapper">
              <input
                type="password"
                placeholder=" "
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage("");
                }}
                required
              />
              <label> Password </label>
            </div>

            <a
              href="#"
              className="font"
              style={{ marginTop: "-15px", marginBottom: "30px" }}
              onClick={() => setShowForgotPopup(true)}
            >
              Forgot password?
            </a>
            <div className="flexCol alignCenter">
              <button type="submit" className="font">
                Log in
              </button>
              <p className="loginLink">
                Don’t have an account?{" "}
                <a href="/registerStartup" className="font">
                  Register.
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {showForgotPopup && (
        <ForgotPassword onClose={() => setShowForgotPopup(false)} />
      )}
    </div>
  );
};

export default Login;
