import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const Home = () => {
  const logos = [
    "./img/logos/Adobe.png",
    "./img/logos/Braze.png",
    "./img/logos/Hellosign.png",
    "./img/logos/Maze.png",
    "./img/logos/Ghost.png",
    "./img/logos/Atlassian.png",
    "./img/logos/Treehouse.png",
    "./img/logos/Intercom.png",
    "./img/logos/Opendoor.png",
    "./img/logos/Hubspot.png",
  ];

  const cards = [
    {
      icon: "./img/icons/icon1.png",
      title: "Goal Setting",
      text: "Set clear and achievable goals for your startup's success.",
    },
    {
      icon: "./img/icons/icon2.png",
      title: "Performance Tracking",
      text: "Monitor mentor performance in real-time and track progress.",
    },
    {
      icon: "./img/icons/icon3.png",
      title: "Reward System",
      text: "Motivate mentors with a secure and rewarding token-based reward system.",
    },
    {
      icon: "./img/icons/icon4.png",
      title: "Knowledge Library",
      text: "Access a comprehensive knowledge library to equip mentors with the skills, and motivation",
    },
  ];

  return (
    <div className="flexCol alignCenter">
      <Header />

      <div className="hero">
        <div className="heroContainer flexCol">
          <h1 className="heroTitle">
            Grow your StartUp! Monitoring and Evaluating now is easy!{" "}
          </h1>
          <p className="heroSubtitle font">
            {" "}
            Welcome to Mentor Token, where we redefine the dynamics of start-up
            success. Our innovative platform offers a transformative approach to
            mentorship, ensuring that mentors are not just engaged but motivated
            to drive the success of the ventures they support.{" "}
          </p>

          <br />

          <div className="getStarted flexRow alignCenter spaceBetween">
            <a
              href="/registerStartup"
              className="getStartedButton flexRow alignCenter justifyCenter"
            >
              <svg
                width="18"
                height="19"
                viewBox="0 0 18 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.8223 4.94727L15.3748 9.49977L10.8223 14.0523"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.625 9.5H15.2475"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h1 className="getStartedText font"> Get Started </h1>
            </a>
            <a href="/contact" className="navBarText font">
              {" "}
              Get in Touch{" "}
            </a>
          </div>

          <img src="./img/HeroLaptop.png" className="heroLaptop" />
        </div>
      </div>

      <div className="logosContainer flexRow">
        {logos.map((element, index) => (
          <div key={index} className="logos flexRow alignCenter">
            <img src={element} />
          </div>
        ))}
      </div>

      <h1 className="logosTitle font">
        More than 25+ Startups around the world trusted Mentor Token.
      </h1>

      <div className="features hero flexCol alignCenter ">
        <img className="rocketImg2" src="./img/rocket.png"></img>
        <h1 className="featuresTitle font"> FEATURES </h1>
        <h1 className="featuresSubitle font">
          Boost Your Startup's Journey: Discover Mentor Token's Robust Features
        </h1>

        <div className="cardContainer flexRow">
          {cards.map((element, index) => (
            <div key={index} className="card flexCol alignStart">
              <img src={element.icon} alt="" />
              <h1 className="cardTitle font"> {element.title} </h1>
              <p className="cardSubtitle font"> {element.text} </p>
            </div>
          ))}
        </div>
      </div>

      <div className="successContainer flexCol alignCenter">
        <h1 className="successTitle">
          Every{" "}
          <span style={{ color: "#696CFF", fontWeight: "750" }}>success</span>{" "}
          is rewarded!{" "}
        </h1>
        <div className="success flexCol alignCenter justifyCenter">
          <img src="./img/successBackground.png" className="successBg" />
          <span>
            {" "}
            <img src="./img/success.png" className="successPhoto" />{" "}
          </span>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;