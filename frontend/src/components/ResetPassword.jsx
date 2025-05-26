import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(null);

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setStatus({ success: false, message: "Passwords do not match." });
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:10000/resetPassword/${token}`,
        {
          password: newPassword,
        }
      );
      setStatus({
        success: true,
        message: "Password reset successful!",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setStatus({
        success: false,
        message: err.response?.data?.message || "Error resetting password",
      });
    }
  };

  return (
    <div className="popupContainer2 flexCol alignCenter justifyCenter">
      <div className="popupCard flexCol alignCenter">
        <div className="popupCardContent flexCol alignCenter justifyCenter">
          <h3 className="font loginTitle">Reset Password</h3>
          <br />
          <p className="font loginSubtitle">Enter a new password below.</p>
          <br />
          <form
            onSubmit={handleReset}
            className="flexCol alignCenter justifyCenter"
          >
            <br />
            <div
              className="inputWrapper flexCol alignCenter"
              style={{ margin: "-5px" }}
            >
              <input
                type="password"
                placeholder=" "
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <label> New Password</label>
            </div>
            <div className="inputWrapper flexCol alignCenter">
              <input
                type="password"
                placeholder=" "
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <label> Confirm New Password</label>
            </div>

            <button
              type="submit"
              className="acceptBtn"
              style={{ marginTop: "-15px", fontSize: "16px" }}
            >
              Reset Password
            </button>
          </form>
        </div>

        {status && (
          <p className="font" style={{ marginTop: "20px", color: "#696CFF" }}>
            {status.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
