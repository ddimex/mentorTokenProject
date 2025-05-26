import React, { useState, useEffect } from "react";
import axios from "axios";

const NewJob = ({ onCancel, addJobToList, fetchJobs }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:10000/createJob",
        { title, description, status: "open" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchJobs();
      onCancel();
    } catch (error) {
      console.error(
        "Error creating job:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div>
      <div className="popupContainer flexCol alignCenter justifyCenter">
        <div className="popupCard flexCol alignCenter">
          <svg
            onClick={onCancel}
            width="20"
            height="20"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.75 4.25L4.25 12.75"
              stroke="#696CFF"
              strokeWidth="1.41667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.25 4.25L12.75 12.75"
              stroke="#696CFF"
              strokeWidth="1.41667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="popupCardContent flexCol alignCenter">
            <h3 className="font loginTitle" style={{ marginBottom: "35px" }}>
              Create a New Job
            </h3>
            <form
              onSubmit={handleSubmit}
              className="flexCol alignCenter"
              style={{ gap: "5px" }}
            >
              <div
                className="inputWrapper flexCol alignCenter"
                style={{ margin: "5px" }}
              >
                <input
                  type="text"
                  placeholder=" "
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <label> Job Title </label>
              </div>
              <div
                className="inputWrapper flexCol alignCenter"
                style={{ margin: "5px" }}
              >
                <input
                  type="text"
                  placeholder=" "
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                <label> Job Description </label>
              </div>

              <button
                type="submit"
                className="acceptBtn"
                style={{ marginTop: "15px", fontSize: "16px" }}
              >
                Create New Job
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewJob;
