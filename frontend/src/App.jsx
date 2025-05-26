// https://www.figma.com/design/8y8KEcHHZaZrYh5jTnHseL/Mentor-Token-%2F-Semos?node-id=0-1&p=f&t=VO2g9QkyfEEmYKwl-0

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import Login from "./Login";
import RegisterStartup from "./RegisterStartup";
import RegisterMentor from "./RegisterMentor";
import StartupDashboard from "./StartupDashboard";
import MentorDashboard from "./MentorDashboard";
import PrivateRoutes from "./components/PrivateRoutes";
import MDJobs from "./components/MDJobs";
import SDMentors from "./components/SDMentors";
import SDJobs from "./components/SDJobs";
import OneMentor from "./components/OneMentor";
import ResetPassword from "./components/ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/registerStartup" element={<RegisterStartup />} />
        <Route path="/registerMentor" element={<RegisterMentor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resetPassword/:token" element={<ResetPassword />} />

        <Route element={<PrivateRoutes />}>
          <Route path="/startupDashboard" element={<StartupDashboard />} />
          <Route path="/startupDashboard/mentors" element={<SDMentors />} />
          <Route path="/startupDashboard/mentors/:id" element={<OneMentor />} />
          <Route path="/startupDashboard/jobs" element={<SDJobs />} />
          <Route path="/mentorDashboard" element={<MentorDashboard />} />
          <Route path="/mentorDashboard/myStats" element={<OneMentor />} />
          <Route path="/mentorDashboard/jobFeed" element={<MDJobs />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
