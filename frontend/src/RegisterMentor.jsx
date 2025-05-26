import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RegisterLoginBG from "./components/RegisterLoginBG";
import ToggleButton from "./components/ToggleButton"


const RegisterMentor = () => {
  const navigate = useNavigate();

  const [count, setCount] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    profilePicture: null,
    mentorName: "",
    phone: "",
    address: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState("./img/mentorDefault.png");

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    containsNumberOrSymbol: false,
    containsNameOrEmail: false,
  });

  const [isTyping, setIsTyping] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "password") {
      setIsTyping(true);
      validatePassword(e.target.value);
    }
  };

  const validatePassword = (password) => {
    const lengthCondition = password.length >= 8;
    const containsNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>_-]/.test(password);
    const containsNameOrEmail =
      (formData.startupName && password.includes(formData.startupName)) ||
      (formData.email && password.includes(formData.email));

    console.log("Password:", password);
    console.log("Email:", formData.email);
    console.log("Startup Name:", formData.startupName);
    console.log("Contains Name or Email check: ", containsNameOrEmail);

    setPasswordStrength({
      length: lengthCondition,
      containsNumberOrSymbol: containsNumberOrSymbol,
      containsNameOrEmail: containsNameOrEmail,
    });
  };

  const getPasswordStrengthLabel = () => {
    const { length, containsNumberOrSymbol, containsNameOrEmail } =
      passwordStrength;

    if (length && containsNumberOrSymbol && !containsNameOrEmail) {
      return "Strong";
    }

    return "Weak";
  };

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleContinue = (e) => {
    e.preventDefault();

    if (
      passwordStrength.length &&
      passwordStrength.containsNumberOrSymbol &&
      !passwordStrength.containsNameOrEmail
    ) {
      setCount(2);
    } else {
      alert("Please make sure your password meets the requirements.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const formDataWithFile = new FormData();
    formDataWithFile.append("email", formData.email);
    formDataWithFile.append("password", formData.password);
    formDataWithFile.append("mentorName", formData.mentorName);
    formDataWithFile.append("phone", formData.phone);
    formDataWithFile.append("address", formData.address);

    if (profilePicture) {
      formDataWithFile.append("profilePicture", profilePicture);
    }

    try {
      const response = await fetch("http://localhost:10000/registerMentor", {
        method: "POST",
        body: formDataWithFile,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to register: ${errorMessage}`);
      }

      navigate("/login");
    } catch (error) {
      console.log(error);
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

          {count === 1 ? (
            <>
              <div className="loginText">
                <h1 className="loginTitle">Choose Account Type</h1>
              </div>
              <ToggleButton />
              <form onSubmit={handleContinue} className="flexCol">
                <div className="inputWrapper">
                  <input
                    type="text"
                    placeholder=" "
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <label>Email</label>
                </div>

                <div className="inputWrapper">
                  <input
                    type="password"
                    placeholder=" "
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <label>Password</label>
                </div>

                <div className="password-strength">
                  {isTyping && (
                    <div
                      className="flexCol"
                      style={{ width: "320px", gap: "10px" }}
                    >
                      <div
                        className="flexRow alignCenter "
                        style={{ gap: "15px" }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.3333 4L5.99996 11.3333L2.66663 8"
                            stroke="#696CFF"
                            strokeOpacity="0.25"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        <p
                          className="font"
                          style={{
                            fontSize: "14px",
                            color:
                              passwordStrength.length &&
                              passwordStrength.containsNumberOrSymbol &&
                              !passwordStrength.containsNameOrEmail
                                ? "#696CFF"
                                : "#AAB4BF",
                          }}
                        >
                          Password Strength: {getPasswordStrengthLabel()}
                        </p>
                      </div>

                      <div
                        className="flexRow alignCenter "
                        style={{ gap: "15px" }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.3333 4L5.99996 11.3333L2.66663 8"
                            stroke="#696CFF"
                            strokeOpacity="0.25"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        <p
                          className="font"
                          style={{
                            fontSize: "14px",
                            color: passwordStrength.containsNameOrEmail
                              ? "#AAB4BF"
                              : "#696CFF",
                          }}
                        >
                          Cannot contain your name or email address
                        </p>
                      </div>

                      <div
                        className="flexRow alignCenter "
                        style={{ gap: "15px" }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.3333 4L5.99996 11.3333L2.66663 8"
                            stroke="#696CFF"
                            strokeOpacity="0.25"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        <p
                          className="font"
                          style={{
                            fontSize: "14px",
                            color: passwordStrength.length
                              ? "#696CFF"
                              : "#AAB4BF",
                          }}
                        >
                          At least 8 characters
                        </p>
                      </div>

                      <div
                        className="flexRow alignCenter "
                        style={{ gap: "15px" }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.3333 4L5.99996 11.3333L2.66663 8"
                            stroke="#696CFF"
                            strokeOpacity="0.25"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        <p
                          className="font"
                          style={{
                            fontSize: "14px",
                            color: passwordStrength.containsNumberOrSymbol
                              ? "#696CFF"
                              : "#AAB4BF",
                          }}
                        >
                          Contains a number or symbol
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flexCol alignCenter">
                  <button className="font">Continue</button>
                  <p className="loginLink">
                    Already have an account?{" "}
                    <a href="/login" className="font">
                      Login.
                    </a>
                  </p>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="loginText">
                <h1 className="loginTitle">Setup Mentor Account</h1>
              </div>
              <form
                onSubmit={handleRegister}
                className="flexCol alignCenter"
                method="post"
                encType="multipart/form-data"
              >
                <img
                  src={preview}
                  alt="Profile Preview"
                  style={{
                    position: "relative",
                    height: "100px",
                    width: "100px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginBottom: "20px"
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    cursor: "pointer",
                    scale: "0.5",
                    top: "-65px",
                    left: "230px",
                    zIndex: "100",
                  }}
                >
                  <img
                    src="./img/editPfp.png"
                    onClick={handleImageClick}
                    alt="Edit Profile"
                  />
                </span>
                <input
                  type="file"
                  name="profilePicture"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  id="fileInput"
                  accept="image/*"
                />
                <div className="inputWrapper">
                  <input
                    type="text"
                    placeholder=" "
                    name="mentorName"
                    value={formData.mentorName}
                    onChange={handleChange}
                  />
                  <label> Mentor Name </label>
                </div>
                <div className="inputWrapper">
                  <input
                    type="text"
                    placeholder=" "
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <label> Phone </label>
                </div>
                <div className="inputWrapper">
                  <input
                    type="text"
                    placeholder=" "
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  <label> Address </label>
                </div>
                <button className="formButton font">Register</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default RegisterMentor;
