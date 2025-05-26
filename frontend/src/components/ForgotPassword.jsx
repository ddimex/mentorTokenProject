import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:10000/forgotPassword", {
        email,
      });
      setStatus({
        success: true,
        message: "Reset link sent! Check your inbox.",
      });
    } catch (err) {
      setStatus({
        success: false,
        message: err.response?.data || "Error sending reset email.",
      });
    }
  };

  return (
    <div className="popupContainer flexCol alignCenter justifyCenter">
      <div className="popupCard flexCol alignCenter">
        <svg
          onClick={onClose}
          width="20"
          height="20"
          viewBox="0 0 17 17"
          fill="none"
        >
          <path
            d="M12.75 4.25L4.25 12.75"
            stroke="#696CFF"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M4.25 4.25L12.75 12.75"
            stroke="#696CFF"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>

        <div className="popupCardContent flexCol alignCenter justifyCenter">
          <h3 className="font loginTitle">Forgot Password</h3>

          <br />
          <p className="font loginSubtitle">
            Enter your email to receive a reset link.
          </p>

          <br />

          <form
            onSubmit={handleSubmit}
            className="flexCol alignCenter justifyCenter"
          >
            <br />
            <div className="inputWrapper flexCol alignCenter">
              <input
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label> Your email </label>
            </div>

            <button
              type="submit"
              className="acceptBtn"
              style={{ marginTop: "0", fontSize: "16px" }}
            >
              Send Reset Link
            </button>
          </form>
        </div>

        {status && (
          <p className="font" style={{ color: "#696CFF" }}>
            {status.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
