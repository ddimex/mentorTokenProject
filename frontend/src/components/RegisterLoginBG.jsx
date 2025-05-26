import React from "react";

const RegisterLoginBG = () => {
  return (
    <div className="login flexRow alignCenter justifyCenter">
      <img className="loginBG" src="./img/LoginBG.png" />
      <div className="loginLeft flexCol">
        <h1>
          Grow your <span> startup! </span>{" "}
        </h1>
        <p> monitoring and evaluating now is easy! </p>
        <div className="alignCenter">
          <img className="alignCenter" src="./img/logos/mentorTokenLogo.png" />
          <p className="logoParagraph">mentortoken.com</p>
        </div>
        <img className="rocketImg" src="./img/rocket.png" />
      </div>
    </div>
  );
};

export default RegisterLoginBG;
