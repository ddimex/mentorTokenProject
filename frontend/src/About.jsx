import Header from "./components/Header";
import Footer from "./components/Footer";

const About = () => {
  const teamMembers = [
    {
      img: "./img/teamMembers/Ian.png",
      name: "Ian Sorell",
      job: "CEO",
      paragraph:
        "Enjoys adventurous travel, seeks new cultures and offbeat destinations",
    },
    {
      img: "./img/teamMembers/Maya.png",
      name: "Maya Matt",
      job: "Founder",
      paragraph: "Pop music lover, seeks joy and exciting pop concerts",
    },
    {
      img: "./img/teamMembers/Alex.png",
      name: "Alex Jensen",
      job: "CTO",
      paragraph: "Bookworm, creative software developer with precision",
    },
    {
      img: "./img/teamMembers/Keira.png",
      name: "Keira Battye",
      job: "Product Designer",
      paragraph: "Creative painter capturing beauty with imaginative artwork",
    },
    {
      img: "./img/teamMembers/Dominic.png",
      name: "Dominic Game",
      job: "3D Artist",
      paragraph: "Football enthusiast, enjoys movie nights with friends",
    },
    {
      img: "./img/teamMembers/James.png",
      name: "James Vial",
      job: "Head of Front-End",
      paragraph:
        "Culinary artist, explores diverse flavors, skilled in cooking",
    },
  ];

  return (
    <div className="flexCol alignCenter">
      <Header />
      <div className="about flexCol alignCenter justifyCenter">
        <div className="aboutContainer flexCol alignCenter justifyCenter ">
          <h1 className="aboutTitle">Meet our team members</h1>
          <p className="aboutSubtitle">
            {" "}
            We Focus on the details of everything we do. All to help businesses
            around the world Focus on what's most important to them.{" "}
          </p>

          <a
            href="/contact"
            className="getStartedButton getInTouchButton flexRow alignCenter"
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
            <h1 className="getStartedText font"> Get in touch </h1>
          </a>
        </div>
      </div>

      <div className="teamMembersContainer flexRow justifyCenter">
        {teamMembers.map((element, index) => (
          <div className="teamMembers flexCol alignCenter ">
            <img key={index} src={element.img} />
            <h1 className="teamName"> {element.name} </h1>
            <h1 className="teamJob"> {element.job} </h1>
            <p className="teamParagraph"> {element.paragraph} </p>

            <div className="iconContainer flexRow alignCenter spaceBetween">
              <img src="./img/icons/facebookIcon.png" alt="" />
              <img src="./img/icons/githubIcon.png" alt="" />
              <img src="./img/icons/linkedinIcon.png" alt="" />
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default About;
